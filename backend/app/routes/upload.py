import os
import uuid
import logging

import bleach
from flask import Blueprint, current_app, jsonify, request
from werkzeug.utils import secure_filename

from app import limiter
from app.utils.parser import parse_resume

logger = logging.getLogger(__name__)

upload_bp = Blueprint('upload', __name__, url_prefix='/api')

ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}


def _allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@upload_bp.route('/upload', methods=['POST'])
@limiter.limit("20 per minute")
def upload_resume():
    """
    POST /api/upload
    Accepts a multipart/form-data file upload.
    Validates the file, extracts text, and returns it to the frontend.
    The file is deleted after text extraction – we never persist raw files.
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in request'}), 400

    file = request.files['file']

    if not file or file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not _allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Only PDF, DOCX, and TXT are allowed.'}), 400

    original_filename = secure_filename(file.filename)
    # Use a UUID prefix so filenames cannot be guessed
    unique_filename = f"{uuid.uuid4()}_{original_filename}"
    upload_folder = current_app.config['UPLOAD_FOLDER']
    file_path = os.path.join(upload_folder, unique_filename)

    file.save(file_path)

    try:
        resume_text = parse_resume(file_path, original_filename)
    except Exception as exc:
        logger.error("Resume parsing failed: %s", exc)
        _safe_remove(file_path)
        return jsonify({'error': 'Failed to parse the resume file. Ensure it is not password-protected.'}), 422
    finally:
        # Always delete the uploaded file immediately
        _safe_remove(file_path)

    if not resume_text or len(resume_text.strip()) < 50:
        return jsonify({'error': 'Could not extract enough text from the file.'}), 422

    # Sanitize extracted text
    clean_text = bleach.clean(resume_text, tags=[], strip=True)

    return jsonify({
        'success': True,
        'filename': original_filename,
        'resume_text': clean_text[:15000],  # Hard cap to avoid huge payloads
        'character_count': len(clean_text),
    }), 200


def _safe_remove(path: str):
    try:
        if os.path.exists(path):
            os.remove(path)
    except OSError as exc:
        logger.warning("Could not delete temp file %s: %s", path, exc)
