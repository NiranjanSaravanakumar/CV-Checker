import io
import json
import logging

import bleach
from flask import Blueprint, current_app, jsonify, request, send_file

from app import db, limiter
from app.models.resume import ResumeAnalysis
from app.utils.gemini_client import analyze_with_gemini
from app.utils.pdf_generator import generate_pdf_report, generate_txt_report

logger = logging.getLogger(__name__)

analyze_bp = Blueprint('analyze', __name__, url_prefix='/api')


@analyze_bp.route('/analyze', methods=['POST'])
@limiter.limit("10 per minute")
def analyze_resume():
    """
    POST /api/analyze
    Body: { "resume_text": "...", "filename": "..." }
    Sends resume text to Gemini and stores the structured JSON analysis.
    """
    data = request.get_json(silent=True)
    if not data or 'resume_text' not in data:
        return jsonify({'error': 'Missing resume_text in request body'}), 400

    resume_text = bleach.clean(str(data['resume_text']), tags=[], strip=True)
    filename = bleach.clean(str(data.get('filename', 'resume')), tags=[], strip=True)[:255]
    job_description = bleach.clean(str(data.get('job_description', '')), tags=[], strip=True)[:5000]

    if len(resume_text.strip()) < 50:
        return jsonify({'error': 'Resume text is too short to analyse'}), 400

    try:
        analysis = analyze_with_gemini(resume_text, job_description=job_description)
    except ValueError as exc:
        logger.error("Gemini analysis error: %s", exc)
        return jsonify({'error': str(exc)}), 502
    except Exception as exc:
        logger.error("Unexpected analysis error: %s", exc)
        return jsonify({'error': 'AI analysis failed. Please try again.'}), 500

    if not analysis:
        return jsonify({'error': 'AI returned an empty analysis. Check your Gemini API key.'}), 500

    # Persist to database
    record = ResumeAnalysis(
        filename=filename,
        resume_text=resume_text[:5000],
        analysis_json=json.dumps(analysis),
        ats_score=int(analysis.get('ats_score', 0)),
        recruiter_score=float(analysis.get('recruiter_impression', 0.0)),
    )
    db.session.add(record)
    db.session.commit()

    return jsonify({
        'success': True,
        'id': record.id,
        'analysis': analysis,
    }), 200


@analyze_bp.route('/report/<int:report_id>', methods=['GET'])
def get_report(report_id):
    """GET /api/report/<id> – Fetch a single stored analysis."""
    record = ResumeAnalysis.query.get_or_404(report_id)
    return jsonify(record.to_dict()), 200


@analyze_bp.route('/report/<int:report_id>/download', methods=['GET'])
def download_report(report_id):
    """
    GET /api/report/<id>/download?format=pdf|txt
    Download the analysis as a PDF or plain-text file.
    """
    fmt = request.args.get('format', 'txt').lower()
    if fmt not in ('pdf', 'txt'):
        return jsonify({'error': "format must be 'pdf' or 'txt'"}), 400

    record = ResumeAnalysis.query.get_or_404(report_id)
    try:
        analysis = json.loads(record.analysis_json or '{}')
    except json.JSONDecodeError:
        analysis = {}

    if fmt == 'pdf':
        pdf_bytes = generate_pdf_report(analysis, record.filename)
        return send_file(
            io.BytesIO(pdf_bytes),
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'resume_analysis_{report_id}.pdf',
        )

    txt_content = generate_txt_report(analysis, record.filename)
    return send_file(
        io.BytesIO(txt_content.encode('utf-8')),
        mimetype='text/plain',
        as_attachment=True,
        download_name=f'resume_analysis_{report_id}.txt',
    )
