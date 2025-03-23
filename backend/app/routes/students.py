from flask import Blueprint, request, jsonify
from ..services.students_services import (
    find_students,
    find_students_mapping,
    find_analysis_tables,
    find_relevant_cols,
)


students_bp = Blueprint("students", __name__)


@students_bp.route("/students", methods=["GET"])
def get_students():
    query = request.args.get("query")
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))
    table_id = request.args.get("table_id")

    if not table_id:
        return jsonify({"error": "Please provide a table id"}), 400
    return find_students(table_id, query, page, limit)


@students_bp.route("/students/mappings", methods=["GET"])
def get_mappings():
    return find_students_mapping()


@students_bp.route("/students/tables", methods=["GET"])
def get_tables():
    return find_analysis_tables()


@students_bp.route("/students/relevant-cols", methods=["GET"])
def get_relevant_cols():
    return find_relevant_cols()
