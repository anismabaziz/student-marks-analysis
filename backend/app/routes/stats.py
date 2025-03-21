from flask import Blueprint
from ..services.stats_service import (
    find_students_stats,
    find_top_performing_students,
    find_lowest_perfoming_students,
    find_grades_distribution,
    find_modules_averages,
)


stats_bp = Blueprint("stats", __name__)


@stats_bp.route("/students/stats", methods=["GET"])
def get_stats():
    return find_students_stats()


@stats_bp.route("/students/top-performing", methods=["GET"])
def get_top_performing():
    return find_top_performing_students()


@stats_bp.route("/students/lowest-performing", methods=["GET"])
def get_lowest_performing():
    return find_lowest_perfoming_students()


@stats_bp.route("/students/grades-distribution", methods=["GET"])
def get_grades_distribution():
    return find_grades_distribution()


@stats_bp.route("/students/modules-averages", methods=["GET"])
def get_modules_averages():
    return find_modules_averages()
