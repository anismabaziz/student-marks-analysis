from flask import jsonify
from app.utils.text import fix_text_order, remove_newlines, reshape_arabic
from app.utils.dataframe import extract_name
from app.utils.llm import generate_titles
from app.utils.tables import gen_mappings, gen_schema, gen_table_query
from app.extensions import db
import pandas as pd
import pdfplumber
from sqlalchemy import Table, MetaData, text
from app.models.tables import TableName
from app.models.mappings import Mapping


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
    db.session.execute(text(query))
    db.session.commit()
    # inserting data
    data = df.to_dict(orient="records")
    metadata = MetaData()
    table = Table(table_name, metadata, autoload_with=db.engine)
    with db.session.begin():
        db.session.execute(table.insert(), data)

    # create table
    new_table = TableName(
        db_name=table_name,
        name=table_name.replace("_", " "),
        valid=False,
    )
    db.session.add(new_table)
    db.session.commit()

    # create mappings
    mappings_data = [
        {"name": name, "db_name": mappings[name], "table_id": new_table.id}
        for name in mappings
    ]
    db.session.bulk_insert_mappings(Mapping, mappings_data)
    db.session.commit()

    return jsonify({"message": "File processed successfully"})
