from flask import Blueprint, request, jsonify
from app.services.tables_service import find_tables, set_table_valid, find_valid_tables

tables_bp = Blueprint("tables", __name__)


@tables_bp.route("/tables", methods=["GET"])
def get_table():
    return find_tables()


@tables_bp.route("/tables/set-valid", methods=["PUT"])
def update_table_valid():
    table_id = request.args.get("table_id")
    if not table_id:
        return jsonify({"error": "Table id is required"}), 400
    return set_table_valid(table_id)


@tables_bp.route("/tables/valid", methods=["GET"])
def get_valid_tables():
    return find_valid_tables()
