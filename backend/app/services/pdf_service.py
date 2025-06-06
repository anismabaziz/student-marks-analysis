from flask import jsonify
from app.utils.text import fix_text_order, remove_newlines, reshape_arabic
from app.utils.dataframe import extract_name
from app.utils.llm import generate_titles
from app.utils.tables import gen_mappings, gen_schema, gen_table_query
import pandas as pd
import pdfplumber
from app.supabase_client import supabase
import psycopg2
from psycopg2 import sql
from app.config.settings import Config

conn_details = {
    "dbname": Config.DB_NAME,
    "user": Config.DB_USER,
    "password": Config.DB_PASSWORD,
    "host": Config.DB_HOST,
    "port": Config.DB_PORT,
    "sslmode": "require",
}


def create_table_if_not_exists(table_name, create_table_query):
    try:
        conn = psycopg2.connect(**conn_details)
        cursor = conn.cursor()
        cursor.execute(
            sql.SQL("""
                SELECT EXISTS (
                    SELECT 1 FROM information_schema.tables
                    WHERE table_name = %s
                );
            """),
            [table_name.lower()],
        )
        table_exists = cursor.fetchone()[0]
        if table_exists:
            print(f"Table '{table_name}' already exists.")
        else:
            cursor.execute(create_table_query)
            conn.commit()
            print(f"Table '{table_name}' created successfully.")
        cursor.close()
        conn.close()
        return True, None
    except Exception as e:
        return False, str(e)


def parse_pdf(path, file_name):
    all_data = []
    i = 0
    csv_path = path.replace("pdf", "csv")

    with pdfplumber.open(path) as pdf:
        for page_num, page in enumerate(pdf.pages, start=1):
            table = page.extract_table()
            if table:
                if i == 0:
                    table = table[1:]
                    table[0][0] = "Name"
                    table[0][1] = "Code"
                    transformed_line = fix_text_order(",".join(table[0]))
                    llm_process_line = generate_titles(transformed_line).split(",")
                    table[0] = remove_newlines(llm_process_line)
                else:
                    table = table[2:]
                i += 1
                reshaped_table = [
                    [reshape_arabic(cell) for cell in row] for row in table
                ]
                corrected_table = [
                    [fix_text_order(cell) if cell else "" for cell in row]
                    for row in reshaped_table
                ]
                all_data.extend(corrected_table)

    df = pd.DataFrame(all_data)
    df.to_csv(csv_path, index=False, quoting=1, sep=",", header=False)
    df = pd.read_csv(csv_path)
    df["Name"] = df["Name"].apply(extract_name)

    mappings = gen_mappings(df)
    schema = gen_schema(mappings, df)
    table_name = f"analysis_{file_name}"
    table_name = table_name.replace(".pdf", "").lower()

    query = gen_table_query(table_name, schema)
    df.columns = [mappings[col] for col in df.columns]

    # creating table
    success, error = create_table_if_not_exists(table_name, query)
    if not success:
        return jsonify({"error": f"Failed to create table: {error}"}), 500

    # inserting data
    data = df.to_dict(orient="records")
    batch_size = 500
    for i in range(0, len(data), batch_size):
        batch = data[i : i + batch_size]
        supabase.table(table_name).insert(batch).execute()

    # create table
    new_table_resp = (
        supabase.table("tables")
        .insert(
            {
                "db_name": table_name,
                "name": table_name.replace("_", " "),
                "valid": False,
            }
        )
        .execute()
    )
    new_table = new_table_resp.data[0]

    # create mappings
    mappings_data = [
        {"name": name, "db_name": mappings[name], "table_id": new_table["id"]}
        for name in mappings
    ]
    batch_size = 500
    for i in range(0, len(mappings_data), batch_size):
        batch = mappings_data[i : i + batch_size]
        supabase.table("mappings").insert(batch).execute()

    return jsonify({"message": "File processed successfully"})
