import io


def generate_pdf_report(analysis: dict, filename: str) -> bytes:
    """Generate a PDF report from the analysis dict using ReportLab."""
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import letter
    from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
    from reportlab.lib.units import inch
    from reportlab.platypus import (
        HRFlowable,
        Paragraph,
        SimpleDocTemplate,
        Spacer,
        Table,
        TableStyle,
    )

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.75 * inch)
    styles = getSampleStyleSheet()

    PURPLE = colors.HexColor('#7C3AED')
    CYAN = colors.HexColor('#06B6D4')
    DARK = colors.HexColor('#0A0A0F')

    title_style = ParagraphStyle(
        'ReportTitle', parent=styles['Title'],
        fontSize=22, textColor=PURPLE, spaceAfter=6,
    )
    h2_style = ParagraphStyle(
        'H2', parent=styles['Heading2'],
        fontSize=13, textColor=CYAN, spaceBefore=14, spaceAfter=4,
    )
    body_style = ParagraphStyle(
        'Body', parent=styles['Normal'],
        fontSize=10, leading=14,
    )
    bullet_style = ParagraphStyle(
        'Bullet', parent=body_style,
        leftIndent=16, bulletIndent=0, spaceBefore=2,
    )

    story = []

    # -- Title ----------------------------------------------------------------
    story.append(Paragraph("AI Roast My Resume – Analysis Report", title_style))
    story.append(Paragraph(f"<font color='grey'>File: {filename}</font>", body_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PURPLE, spaceAfter=10))

    # -- Score summary --------------------------------------------------------
    story.append(Paragraph("Score Summary", h2_style))
    score_data = [
        ["ATS Score", f"{analysis.get('ats_score', 'N/A')} / 100"],
        ["Recruiter Impression", f"{analysis.get('recruiter_impression', 'N/A')} / 10"],
        ["Would Recruiter Shortlist?", analysis.get('recruiter_shortlist_prediction', 'N/A')],
    ]
    tbl = Table(score_data, colWidths=[2.5 * inch, 3 * inch])
    tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#1E1E2E')),
        ('TEXTCOLOR', (0, 0), (0, -1), CYAN),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#2E2E3E')),
    ]))
    story.append(tbl)
    story.append(Spacer(1, 0.15 * inch))

    # -- Helper to render list sections ---------------------------------------
    def _section(title: str, items: list):
        if not items:
            return
        story.append(Paragraph(title, h2_style))
        for item in items:
            if isinstance(item, dict):
                original = item.get('original', '')
                improved = item.get('improved', '')
                story.append(Paragraph(f"<b>Before:</b> {original}", bullet_style))
                story.append(Paragraph(f"<b>After:</b> {improved}", bullet_style))
                story.append(Spacer(1, 0.05 * inch))
            else:
                story.append(Paragraph(f"• {item}", bullet_style))

    _section("Resume Roast 🔥", analysis.get('roast', []))
    _section("Reality Check", analysis.get('reality_check', []))
    _section("How to Make This Resume Top 1%", analysis.get('top_1_percent_advice', []))
    _section("Improved Bullet Points", analysis.get('improved_bullets', []))
    _section("Formatting Issues", analysis.get('formatting_issues', []))
    _section("Missing Skills", analysis.get('missing_skills', []))
    _section("Portfolio Suggestions", analysis.get('portfolio_suggestions', []))

    # -- Interview questions ---------------------------------------------------
    iq = analysis.get('interview_questions', {})
    if iq:
        story.append(Paragraph("Interview Questions", h2_style))
        for category, questions in iq.items():
            story.append(Paragraph(f"<b>{category.replace('_', ' ').title()}</b>", body_style))
            for q in questions or []:
                story.append(Paragraph(f"• {q}", bullet_style))
            story.append(Spacer(1, 0.05 * inch))

    # -- LinkedIn / GitHub ----------------------------------------------------
    if analysis.get('linkedin_headline'):
        story.append(Paragraph("Suggested LinkedIn Headline", h2_style))
        story.append(Paragraph(analysis['linkedin_headline'], body_style))

    if analysis.get('github_bio'):
        story.append(Paragraph("Suggested GitHub Bio", h2_style))
        story.append(Paragraph(analysis['github_bio'], body_style))

    doc.build(story)
    return buffer.getvalue()


def generate_txt_report(analysis: dict, filename: str) -> str:
    """Generate a plain-text version of the analysis report."""
    lines = [
        "=" * 60,
        "AI ROAST MY RESUME – ANALYSIS REPORT",
        f"File: {filename}",
        "=" * 60,
        "",
        f"ATS Score            : {analysis.get('ats_score', 'N/A')}/100",
        f"Recruiter Impression : {analysis.get('recruiter_impression', 'N/A')}/10",
        f"Would Shortlist?     : {analysis.get('recruiter_shortlist_prediction', 'N/A')}",
        "",
    ]

    def _section(title: str, items):
        if not items:
            return
        lines.append(f"{'─' * 60}")
        lines.append(title.upper())
        lines.append("")
        for item in items:
            if isinstance(item, dict):
                lines.append(f"  BEFORE : {item.get('original', '')}")
                lines.append(f"  AFTER  : {item.get('improved', '')}")
                lines.append("")
            else:
                lines.append(f"  • {item}")
        lines.append("")

    _section("Resume Roast", analysis.get('roast', []))
    _section("Reality Check", analysis.get('reality_check', []))
    _section("How to Make This Resume Top 1%", analysis.get('top_1_percent_advice', []))
    _section("Improved Bullet Points", analysis.get('improved_bullets', []))
    _section("Missing Skills", analysis.get('missing_skills', []))
    _section("Portfolio Suggestions", analysis.get('portfolio_suggestions', []))

    iq = analysis.get('interview_questions', {})
    if iq:
        lines.append("─" * 60)
        lines.append("INTERVIEW QUESTIONS")
        lines.append("")
        for cat, questions in iq.items():
            lines.append(f"  [{cat.replace('_', ' ').upper()}]")
            for q in questions or []:
                lines.append(f"  • {q}")
            lines.append("")

    if analysis.get('linkedin_headline'):
        lines.append("─" * 60)
        lines.append("LINKEDIN HEADLINE")
        lines.append(f"  {analysis['linkedin_headline']}")
        lines.append("")

    if analysis.get('github_bio'):
        lines.append("─" * 60)
        lines.append("GITHUB BIO")
        lines.append(f"  {analysis['github_bio']}")
        lines.append("")

    lines.append("=" * 60)
    lines.append("Generated by AI Roast My Resume")
    return "\n".join(lines)
