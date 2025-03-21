from flask import Blueprint
from ..services.students_services import get_students_data, get_students_mapping


students_bp = Blueprint("students", __name__)


@students_bp.route("/students", methods=["GET"])
def get_students():
    return get_students_data()


@students_bp.route("/students/mappings", methods=["GET"])
def get_mappings():
    return get_students_mapping()
