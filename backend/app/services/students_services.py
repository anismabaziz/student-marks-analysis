from flask import jsonify
from app.supabase_client import supabase


def find_students(table_id, query=None):
    # Same as before to get table and mappings
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

    # Build the query for students
    students_query = supabase.table(table_name).select("*")
    if query:
        students_query = students_query.ilike("name", f"%{query}%")

    # Fetch ALL students
    students_resp = students_query.execute()
    students = students_resp.data

    # Get the mappings for the table
    mappings_resp = (
        supabase.table("analysis_mappings")
        .select("*")
        .eq("table_id", table_id)
        .execute()
    )
    mappings = mappings_resp.data

    return jsonify(
        {"students": students, "total_students": len(students), "mappings": mappings}
    )
