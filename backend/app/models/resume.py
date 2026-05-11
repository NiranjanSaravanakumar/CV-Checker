from app import db
from datetime import datetime
import json


class ResumeAnalysis(db.Model):
    """Stores each resume upload and its AI analysis result."""

    __tablename__ = 'resume_analyses'

    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    # Store a truncated snapshot of the original text (not the full text for storage efficiency)
    resume_text = db.Column(db.Text, nullable=False)
    # Full Gemini JSON response stored as a string
    analysis_json = db.Column(db.Text, nullable=True)
    ats_score = db.Column(db.Integer, nullable=True)
    recruiter_score = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        analysis = {}
        if self.analysis_json:
            try:
                analysis = json.loads(self.analysis_json)
            except json.JSONDecodeError:
                analysis = {}

        return {
            'id': self.id,
            'filename': self.filename,
            'ats_score': self.ats_score,
            'recruiter_score': self.recruiter_score,
            'created_at': self.created_at.isoformat(),
            'analysis': analysis,
        }

    def to_summary_dict(self):
        """Lightweight version used for the history list (no full analysis)."""
        return {
            'id': self.id,
            'filename': self.filename,
            'ats_score': self.ats_score,
            'recruiter_score': self.recruiter_score,
            'created_at': self.created_at.isoformat(),
        }
