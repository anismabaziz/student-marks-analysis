from flask import jsonify
import pandas as pd
from app.supabase_client import supabase


def find_students_stats(table_id, module):
    # Step 1: Fetch the table info from the 'tables' table
    table_resp = (
        supabase.table("analysis_tables")
        .select("*")
        .eq("id", table_id)
        .single()
        .execute()
    )
    if table_resp.data is None:
        return jsonify({"error": "Table not found"}), 404

    table_data = table_resp.data
    table_name = table_data["db_name"]

    # Step 2: Fetch all students data from the dynamic table
    students_resp = supabase.table(table_name).select("*").execute()
    students_data = students_resp.data
    all_students = len(students_data)

    if not students_data:
        return jsonify({"error": "No students found in table"}), 404

    # Convert to pandas DataFrame
    df = pd.DataFrame(students_data)

    if module not in df.columns:
        return jsonify({"error": f"Column '{module}' not found"}), 400

    # Step 3: Calculate stats
    # Handle missing or non-numeric data in the module column
    df[module] = pd.to_numeric(df[module], errors="coerce")
    df_module = df.dropna(subset=[module])

    avg_grade = df_module[module].mean()
    max_grade = df_module[module].max()
    min_grade = df_module[module].min()
    passing_students = df_module[df_module[module] >= 10].shape[0]
    passing_rate = (passing_students / all_students) * 100 if all_students > 0 else 0

    return jsonify(
        {
            "module": module,
            "average_grade": round(avg_grade, 2) if avg_grade is not None else None,
            "max_grade": max_grade,
            "min_grade": min_grade,
            "passing_rate": round(passing_rate, 2),
        }
    )


def find_top_performing_students(table_id, module):
    # Step 1: Get table info
    table_resp = (
        supabase.table("analysis_tables")
        .select("*")
        .eq("id", table_id)
        .single()
        .execute()
    )
    if table_resp.data is None:
        return jsonify({"error": "Table not found"}), 404

    table_data = table_resp.data
    table_name = table_data["db_name"]

    # Step 2: Validate column existence
    # Fetch one row to see columns
    first_row_resp = supabase.table(table_name).select("*").limit(1).execute()
    if not first_row_resp.data:
        return jsonify({"error": f"Table '{table_name}' has no data"}), 404

    if module not in first_row_resp.data[0]:
        return jsonify({"error": f"Column '{module}' not found"}), 400

    # Step 3: Fetch top 5 students ordered by the module column
    top_students_resp = (
        supabase.table(table_name)
        .select("*")
        .order(module, desc=True)
        .limit(5)
        .execute()
    )

    return jsonify({"module": module, "students": top_students_resp.data})


def find_lowest_perfoming_students(table_id, module):
    # Step 1: Get table info
    table_resp = (
        supabase.table("analysis_tables")
        .select("*")
        .eq("id", table_id)
        .single()
        .execute()
    )
    if table_resp.data is None:
        return jsonify({"error": "Table not found"}), 404

    table_data = table_resp.data
    table_name = table_data["db_name"]

    # Step 2: Validate column existence
    first_row_resp = supabase.table(table_name).select("*").limit(1).execute()
    if not first_row_resp.data:
        return jsonify({"error": f"Table '{table_name}' has no data"}), 404

    if module not in first_row_resp.data[0]:
        return jsonify({"error": f"Column '{module}' not found"}), 400

    # Step 3: Fetch lowest performing students
    lowest_students_resp = (
        supabase.table(table_name)
        .select("*")
        .gt(module, 1)
        .order(module, desc=False)
        .limit(5)
        .execute()
    )

    return jsonify({"module": module, "students": lowest_students_resp.data})


def find_grades_distribution(table_id):
    # Step 1: Get the table info
    table_resp = (
        supabase.table("analysis_tables")
        .select("*")
        .eq("id", table_id)
        .single()
        .execute()
    )
    if table_resp.data is None:
        return jsonify({"error": "Table not found"}), 404

    table_data = table_resp.data
    table_name = table_data["db_name"]

    # Step 2: Validate column existence and fetch grades
    first_row_resp = supabase.table(table_name).select("*").limit(1).execute()
    if not first_row_resp.data:
        return jsonify({"error": f"Table '{table_name}' has no data"}), 404

    if "moyenne_du_semestre" not in first_row_resp.data[0]:
        return jsonify({"error": "Column 'moyenne_du_semestre' not found"}), 400

    # Step 3: Fetch all 'moyenne_du_semestre' values
    grades_resp = supabase.table(table_name).select("moyenne_du_semestre").execute()

    grades = [
        row["moyenne_du_semestre"]
        for row in grades_resp.data
        if row["moyenne_du_semestre"] is not None
    ]

    # Step 4: Create bins and counts
    bin_edges = list(range(0, 18 + 2, 2))  # [0, 2, 4, ..., 18]
    bins = [[bin_edges[i], bin_edges[i + 1]] for i in range(len(bin_edges) - 1)]
    counts = [0] * (len(bin_edges) - 1)

    for grade in grades:
        for i in range(len(bin_edges) - 1):
            if bin_edges[i] <= grade < bin_edges[i + 1]:
                counts[i] += 1
                break

    return jsonify({"bins": bins, "counts": counts})


def find_modules_averages(table_id):
    # Step 1: Get the table info
    table_resp = (
        supabase.table("analysis_tables")
        .select("*")
        .eq("id", table_id)
        .single()
        .execute()
    )
    if table_resp.data is None:
        return jsonify({"error": "Table not found"}), 404

    table_data = table_resp.data
    table_name = table_data["db_name"]

    # Step 2: Get mappings
    mappings_resp = (
        supabase.table("analysis_mappings")
        .select("*")
        .eq("table_id", table_id)
        .execute()
    )
    if not mappings_resp.data:
        return jsonify({"error": "Mappings not found"}), 404

    mappings = mappings_resp.data

    # Step 3: Determine relevant columns (filter out unwanted words)
    unwanted_words = ["credit_ue", "moyenne_ue", "credits", "name", "code"]
    relevant_mappings = [
        mapping
        for mapping in mappings
        if not any(word in mapping["db_name"] for word in unwanted_words)
    ]
    columns_to_include = [col["db_name"] for col in relevant_mappings]

    if not columns_to_include:
        return jsonify({"error": "No relevant numeric modules found"}), 404

    # Step 4: Fetch all relevant columns for all students
    students_resp = (
        supabase.table(table_name).select(",".join(columns_to_include)).execute()
    )
    if not students_resp.data:
        return jsonify({"error": "No students data found"}), 404

    students_data = students_resp.data

    # Step 5: Compute averages for each column
    averages_dict_arr = []
    for col in columns_to_include:
        values = [
            row[col]
            for row in students_data
            if row[col] is not None and isinstance(row[col], (int, float))
        ]
        if values:
            avg = round(sum(values) / len(values), 2)
            averages_dict_arr.append({"name": col, "average": avg})
        else:
            averages_dict_arr.append({"name": col, "average": None})

    return jsonify({"averages": averages_dict_arr})
