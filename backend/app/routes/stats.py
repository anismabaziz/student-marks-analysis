from flask import Blueprint, request, jsonify
from ..services.stats_service import (
    find_students_stats,
    find_top_performing_students,
    find_lowest_perfoming_students,
    find_grades_distribution,
    find_modules_averages,
)


stats_bp = Blueprint("stats", __name__)


@stats_bp.route("/stats", methods=["GET"])
def get_stats():
    module = request.args.get("module")
    table_id = request.args.get("table_id")
    if not module:
        return jsonify({"error": "Please provide a module name"}), 400
    if not table_id:
        return jsonify({"error": "Please provide a table id"}), 400

    return find_students_stats(table_id, module), 200


@stats_bp.route("/stats/top-performing", methods=["GET"])
def get_top_performing():
    module = request.args.get("module")
    table_id = request.args.get("table_id")
    if not module:
        return jsonify({"error": "Please provide a module name"}), 400
    if not table_id:
        return jsonify({"error": "Please provide a table id"}), 400
    return find_top_performing_students(table_id, module), 200


@stats_bp.route("/stats/lowest-performing", methods=["GET"])
def get_lowest_performing():
    module = request.args.get("module")
    table_id = request.args.get("table_id")
    if not module:
        return jsonify({"error": "Please provide a module name"}), 400
    if not table_id:
        return jsonify({"error": "Please provide a table id"}), 400
    return find_lowest_perfoming_students(table_id, module), 200


@stats_bp.route("/stats/grades-distribution", methods=["GET"])
def get_grades_distribution():
    table_id = request.args.get("table_id")
    if not table_id:
        return jsonify({"error": "Please provide a table id"}), 400
    return find_grades_distribution(table_id), 200


@stats_bp.route("/stats/modules-averages", methods=["GET"])
def get_modules_averages():
    table_id = request.args.get("table_id")
    if not table_id:
        return jsonify({"error": "Please provide a table id"}), 400
    return find_modules_averages(table_id)
