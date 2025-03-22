from flask import Blueprint, jsonify, request
import os
from app.services.pdf_service import parse_pdf

pdf_bp = Blueprint("pdf", __name__)


BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@pdf_bp.route("/pdf/process", methods=["POST"])
def process_pdf():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    pdf_file = request.files["file"]

    if pdf_file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    if not pdf_file.filename.endswith(".pdf"):
        return jsonify({"error": "Only PDF files are allowed"}), 400

    pdf_path = os.path.join(UPLOAD_FOLDER, pdf_file.filename)
    pdf_file.save(pdf_path)

    return parse_pdf(pdf_path, pdf_file.filename)
