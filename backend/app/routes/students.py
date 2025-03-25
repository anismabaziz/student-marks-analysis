from flask import Blueprint, request, jsonify
from ..services.students_services import (
    find_students,
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
