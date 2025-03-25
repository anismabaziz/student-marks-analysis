from flask import jsonify
from app.models.tables import TableName
from app.extensions import metadata, db
import pandas as pd
import numpy as np
from sqlalchemy import desc
from app.models.mappings import Mapping


def find_students_stats(table_id, module):
    table = TableName.query.get(table_id)
    if not table:
        return jsonify({"error": "Table not found"}), 404

    table_model = metadata.tables[table.db_name]
    students_response = db.session.query(table_model).all()
    students_dict = [dict(row._mapping) for row in students_response]
    students_count = db.session.query(table_model).count()

    data = pd.DataFrame(students_dict)
    all_students = students_count

    if module not in data.columns:
        return jsonify({"error": f"Column '{module}' not found"}), 400

    avg_grade = data[module].mean()
    max_grade = data[module].max()
    min_grade = data[module].min()
    passing_students = data.loc[data[module] >= 10, module].count()
    passing_rate = (passing_students / all_students) * 100

    return jsonify(
        {
            "module": module,
            "average_grade": round(avg_grade, 2),
            "max_grade": max_grade,
            "min_grade": min_grade,
            "passing_rate": round(passing_rate, 2),
        }
    )


def find_top_performing_students(table_id, module):
    table = TableName.query.get(table_id)
    if not table:
        return jsonify({"error": "Table not found"}), 404
    table_model = metadata.tables[table.db_name]

    response = db.session.query(table_model).order_by(desc(module)).limit(5).all()
    students = [dict(row._mapping) for row in response]

    return jsonify({"module": module, "students": students})


def find_lowest_perfoming_students(table_id, module):
    table = TableName.query.get(table_id)
    if not table:
        return jsonify({"error": "Table not found"}), 404
    table_model = metadata.tables[table.db_name]

    response = (
        db.session.query(table_model)
        .where(table_model.c[module] > 1)
        .order_by(module)
        .limit(5)
        .all()
    )
    students = [dict(row._mapping) for row in response]
    return jsonify({"module": module, "students": students})


def find_grades_distribution(table_id):
    table = TableName.query.get(table_id)
    if not table:
        return jsonify({"error": "Table not found"}), 404

    table_model = metadata.tables[table.db_name]
    students_response = db.session.query(table_model).all()
    students_dict = [dict(row._mapping) for row in students_response]

    data = pd.DataFrame(students_dict)

    moyennes_semestre = data["moyenne_du_semestre"].values
    bin_edges = np.arange(0, 18, 2)
    i = 0
    bins = []
    for i in range(len(bin_edges) - 1):
        bins.append([int(bin_edges[i]), int(bin_edges[i + 1])])

    counts, _ = np.histogram(moyennes_semestre, bins=bin_edges)

    return jsonify({"bins": bins, "counts": counts.tolist()})


def find_modules_averages(table_id):
    table = TableName.query.get(table_id)
    if not table:
        return jsonify({"error": "Table not found"}), 404

    table_model = metadata.tables[table.db_name]
    students_response = db.session.query(table_model).all()
    students_dict = [dict(row._mapping) for row in students_response]

    mappings_response = Mapping.query.filter(Mapping.table_id == table_id)
    mappings = [mapping.to_dict() for mapping in mappings_response]

    if not mappings:
        return jsonify({"error": "Mappings not found"}), 404

    data = pd.DataFrame(students_dict)
    averages = data.select_dtypes("float64", "int64").mean().round(2)

    unwanted_words = ["credit_ue", "moyenne_ue", "credits", "name", "code"]
    relevant_mappings = [
        mapping
        for mapping in mappings
        if not any(word in mapping["db_name"] for word in unwanted_words)
    ]
    columns_to_include = [col["db_name"] for col in relevant_mappings]
    averages = averages[columns_to_include]
    averages_dict_arr = [{"name": col, "average": avg} for col, avg in averages.items()]

    return jsonify({"averages": averages_dict_arr})
