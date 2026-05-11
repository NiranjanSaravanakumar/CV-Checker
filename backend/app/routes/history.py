import logging

from flask import Blueprint, jsonify, request

from app import db
from app.models.resume import ResumeAnalysis

logger = logging.getLogger(__name__)

history_bp = Blueprint('history', __name__, url_prefix='/api')


@history_bp.route('/history', methods=['GET'])
def get_history():
    """
    GET /api/history?page=1&per_page=10
    Returns a paginated list of past analyses (summary only, no full JSON).
    """
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 50)

    pagination = (
        ResumeAnalysis.query
        .order_by(ResumeAnalysis.created_at.desc())
        .paginate(page=page, per_page=per_page, error_out=False)
    )

    return jsonify({
        'success': True,
        'analyses': [item.to_summary_dict() for item in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page,
    }), 200


@history_bp.route('/history/<int:analysis_id>', methods=['DELETE'])
def delete_analysis(analysis_id):
    """DELETE /api/history/<id> – Remove a stored analysis."""
    record = ResumeAnalysis.query.get_or_404(analysis_id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Analysis deleted successfully'}), 200
