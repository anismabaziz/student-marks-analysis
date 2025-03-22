from flask import jsonify
from app.utils.text import fix_text_order, remove_newlines, reshape_arabic
from app.utils.llm import generate_titles
import pandas as pd
import pdfplumber


def parse_pdf(path, file_name):
    all_data = []
    i = 0
    csv_path = path.replace("pdf", "csv")
    print(csv_path)

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

    return jsonify({"message": "Pdf parsed successfully"})
