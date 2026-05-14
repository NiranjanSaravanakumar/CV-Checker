import json
import logging
import os
import re

from google import genai
from google.genai import types

from app.utils.prompts import get_analysis_prompt

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Constants – gemini-2.5-flash is the available model on this account
# ---------------------------------------------------------------------------
_MODEL_NAME = 'gemini-2.5-flash'

# Default values used when a field is missing or the model omits it
_DEFAULTS = {
    "ats_score": 50,
    "recruiter_impression": 5.0,
    "recruiter_shortlist_prediction": "Maybe",
    "roast": [],
    "weak_skills": [],
    "buzzwords": [],
    "missing_projects": [],
    "fake_sounding_claims": [],
    "improved_bullets": [],
    "interview_questions": {"technical": [], "hr": [], "project_based": []},
    "top_1_percent_advice": [],
    "reality_check": [],
    "skill_confidence": {},
    "ats_keywords": {"found": [], "missing": []},
    "formatting_issues": [],
    "portfolio_suggestions": [],
    "linkedin_headline": "",
    "github_bio": "",
    "resume_strength_radar": {
        "technical_skills": 50, "experience": 50, "projects": 50,
        "education": 50, "achievements": 50, "presentation": 50
    },
    "copied_content_warning": False,
    "overused_github_projects": [],
    "missing_skills": [],
}


def analyze_with_gemini(resume_text: str, job_description: str = '') -> dict:
    """
    Send resume_text (and optional job_description) to the Gemini API and return
    a fully-populated analysis dict.

    Uses response_mime_type='application/json' to force Gemini to emit valid JSON.
    Falls back to regex extraction if the model still wraps output in markdown.
    Always returns a complete dict with defaults for any missing keys.
    """
    api_key = os.environ.get('GEMINI_API_KEY', '').strip()
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not configured. Add it to your .env file.")

    client = genai.Client(api_key=api_key)
    prompt = get_analysis_prompt(resume_text, job_description=job_description)

    logger.info("Sending resume to Gemini (%d chars)…", len(resume_text))

    try:
        response = client.models.generate_content(
            model=_MODEL_NAME,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.4,       # lower = more deterministic / less hallucination
                top_p=0.90,
                max_output_tokens=8192,
                response_mime_type='application/json',  # forces valid JSON output
            ),
        )
    except Exception as exc:
        error_text = str(exc)
        lowered = error_text.lower()

        if 'permission_denied' in lowered or 'api key' in lowered or 'unauth' in lowered:
            raise ValueError(
                'Gemini API key is invalid, revoked, or blocked. '
                'Create a new key in Google AI Studio and update backend/.env.'
            ) from exc
        if 'quota' in lowered or 'rate' in lowered or 'resource_exhausted' in lowered:
            raise ValueError(
                'Gemini API quota/rate limit reached. Please wait and retry.'
            ) from exc

        raise ValueError(f'Gemini request failed: {error_text}') from exc

    raw = response.text.strip()
    logger.debug("Raw Gemini response (first 300 chars): %s", raw[:300])

    result = _parse_json_robust(raw)

    # Fill in any missing keys with safe defaults
    merged = dict(_DEFAULTS)
    merged.update(result)

    # Ensure nested dicts also have defaults
    if not isinstance(merged.get('interview_questions'), dict):
        merged['interview_questions'] = _DEFAULTS['interview_questions']
    if not isinstance(merged.get('ats_keywords'), dict):
        merged['ats_keywords'] = _DEFAULTS['ats_keywords']
    if not isinstance(merged.get('resume_strength_radar'), dict):
        merged['resume_strength_radar'] = _DEFAULTS['resume_strength_radar']

    logger.info("Gemini analysis complete. ATS score: %s", merged.get('ats_score'))
    return merged


def _parse_json_robust(raw: str) -> dict:
    """
    Try several strategies to extract a JSON object from the model's raw output.
    Raises ValueError only as a last resort.
    """
    # Strategy 1: direct parse (works when response_mime_type is respected)
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        pass

    # Strategy 2: strip markdown fences
    cleaned = re.sub(r'^```(?:json)?\s*', '', raw, flags=re.IGNORECASE)
    cleaned = re.sub(r'\s*```\s*$', '', cleaned).strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # Strategy 3: extract the first {...} block (handles extra prose before/after)
    match = re.search(r'\{.*\}', cleaned, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    # Strategy 4: truncated JSON — find last complete top-level value by
    # walking backward from the last closing brace/bracket
    for end in range(len(cleaned), 0, -1):
        candidate = cleaned[:end]
        if candidate.rstrip().endswith(('}', ']', '"', 'true', 'false')):
            try:
                return json.loads(candidate + '}')
            except json.JSONDecodeError:
                continue

    logger.error("All JSON parse strategies failed. Raw (first 600 chars): %s", raw[:600])
    raise ValueError(
        "Gemini returned output that could not be parsed as JSON. "
        "Please try again."
    )

