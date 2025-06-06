from flask import jsonify
from app.supabase_client import supabase


def find_students(table_id, query, page, limit):
    # First, get the table record from the "tables" table
    table_resp = (
        supabase.table("tables").select("*").eq("id", table_id).single().execute()
    )
    if table_resp.data is None:
        return jsonify({"error": "Table not found"}), 404

    table_data = table_resp.data
    table_name = table_data["db_name"]

    # Build the query for students in the dynamic table
    students_query = supabase.table(table_name).select("*")

    if query:
        # Using ilike for case-insensitive partial match
        students_query = students_query.ilike("name", f"%{query}%")

    # Pagination
    start = (page - 1) * limit
    end = start + limit - 1
    students_resp = students_query.range(start, end).execute()

    students = students_resp.data

    # Get the total count of students
    count_resp = supabase.table(table_name).select("*", count="exact").execute()
    total_students = count_resp.count

    # Get the mappings for the table
    mappings_resp = (
        supabase.table("mappings").select("*").eq("table_id", table_id).execute()
    )

    mappings = mappings_resp.data

    return jsonify(
        {
            "students": students,
            "page": page,
            "limit": limit,
            "total_students": total_students,
            "mappings": mappings,
        }
    )
