def get_analysis_prompt(resume_text: str, job_description: str = '') -> str:
    """
    Build the master Gemini prompt.

    Tone  : Gordon Ramsay meets a FAANG senior engineer — harsh, direct,
            funny in places, but ALWAYS actionable and motivating.
    Format: Return ONLY valid JSON. No markdown fences, no explanation text.
    """
    # Truncate to avoid exceeding context window while keeping meaningful content
    truncated = resume_text[:8000]
    jd_truncated = job_description.strip()[:4000] if job_description else ''

    jd_section = ''
    jd_instruction = ''
    if jd_truncated:
        jd_section = f"""

TARGET JOB DESCRIPTION:
---
{jd_truncated}
---"""
        jd_instruction = """
7. The candidate has supplied a TARGET JOB DESCRIPTION. Use it to:
   - Re-score ats_score specifically for this role.
   - Populate ats_keywords.found / ats_keywords.missing based on the JD's requirements.
   - Tailor interview questions to the role described.
   - Flag skills required by the JD that are absent from the resume in missing_skills.
   - Make portfolio_suggestions relevant to this exact role."""

    return f"""You are a brutally honest senior tech recruiter with 15+ years of experience
hiring at top companies (Google, Meta, Amazon, Goldman Sachs, top startups).

Your mission: perform the most thorough, honest, and actionable resume analysis
possible. Think Gordon Ramsay meets a senior staff engineer — harsh, direct,
sometimes darkly funny, but genuinely invested in helping the person improve.

RULES:
1. Be specific. Quote EXACT phrases from the resume. Never write generic advice.
2. Detect AI-generated or copy-pasted content (look for suspiciously polished
   language with no personal specificity).
3. Flag overused/cliché GitHub portfolio projects (todo apps, weather apps,
   calculator apps, Netflix/Amazon clones, etc.).
4. Never discriminate on name, gender, nationality, or background.
5. Focus exclusively on professional content quality.
6. Return ONLY a single valid JSON object — no markdown, no prose before or after.{jd_instruction}

RESUME:
---
{truncated}
---{jd_section}

Return EXACTLY this JSON structure (all fields required, use empty arrays/strings
if information is not applicable):

{{
  "ats_score": <integer 0-100>,
  "recruiter_impression": <float 0.0-10.0>,
  "recruiter_shortlist_prediction": "<Yes | No | Maybe>",

  "roast": [
    "<specific, biting but constructive critique referencing the actual resume text>",
    "<critique 2>",
    "<critique 3>",
    "<critique 4>",
    "<critique 5>"
  ],

  "weak_skills": ["<vague or poorly evidenced skill listed on resume>"],

  "buzzwords": ["<overused buzzword or filler phrase found verbatim in resume>"],

  "missing_projects": [
    "<type of project this person SHOULD have given their claimed role/stack>"
  ],

  "fake_sounding_claims": [
    "<direct quote or paraphrase of an exaggerated / unverifiable claim>"
  ],

  "improved_bullets": [
    {{
      "original": "<weak bullet point from resume>",
      "improved": "<rewritten with strong action verb, quantified impact, specificity>"
    }}
  ],

  "interview_questions": {{
    "technical": [
      "<hard technical question based on skills listed>",
      "<question 2>",
      "<question 3>",
      "<question 4>",
      "<question 5>"
    ],
    "hr": [
      "<behavioural / culture-fit question>",
      "<question 2>",
      "<question 3>"
    ],
    "project_based": [
      "<deep-dive question about a specific project on the resume>",
      "<question 2>",
      "<question 3>"
    ]
  }},

  "top_1_percent_advice": [
    "<concrete, specific action to elevate this resume to top-1%>",
    "<advice 2>",
    "<advice 3>",
    "<advice 4>",
    "<advice 5>"
  ],

  "reality_check": [
    "<honest, grounding observation about career positioning or trajectory>",
    "<point 2>",
    "<point 3>"
  ],

  "skill_confidence": {{
    "<skill name as string>": <integer confidence 0-100>
  }},

  "ats_keywords": {{
    "found": ["<keyword present in resume>"],
    "missing": ["<high-value keyword missing for their target role>"]
  }},

  "formatting_issues": [
    "<specific formatting or structural problem observed>"
  ],

  "portfolio_suggestions": [
    "<unique, impressive project idea tailored to their domain>",
    "<suggestion 2>",
    "<suggestion 3>"
  ],

  "linkedin_headline": "<punchy, keyword-rich LinkedIn headline for this person>",

  "github_bio": "<compelling 3-4 sentence GitHub profile bio for this person>",

  "resume_strength_radar": {{
    "technical_skills": <integer 0-100>,
    "experience": <integer 0-100>,
    "projects": <integer 0-100>,
    "education": <integer 0-100>,
    "achievements": <integer 0-100>,
    "presentation": <integer 0-100>
  }},

  "copied_content_warning": <true | false>,

  "overused_github_projects": ["<name of cliché project detected, e.g. To-Do App>"],

  "missing_skills": ["<critical skill absent from resume for their apparent target role>"]
}}"""
