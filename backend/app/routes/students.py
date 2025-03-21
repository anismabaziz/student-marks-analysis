from flask import Blueprint
from ..services.students_services import (
    find_students_data,
    find_students_mapping,
    find_analysis_tables,
    find_relevant_cols,
)


students_bp = Blueprint("students", __name__)


@students_bp.route("/students", methods=["GET"])
def get_students():
    return find_students_data()


@students_bp.route("/students/mappings", methods=["GET"])
def get_mappings():
    return find_students_mapping()


@students_bp.route("/students/tables", methods=["GET"])
def get_tables():
    return find_analysis_tables()


@students_bp.route("/students/relevant-cols", methods=["GET"])
def get_relevant_cols():
    return find_relevant_cols()
