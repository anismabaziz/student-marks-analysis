from pandas.api.types import is_float_dtype, is_integer_dtype, is_object_dtype
from app.utils.llm import generate_db_names
from app.utils.text import remove_newlines


def gen_mappings(data):
    db_cols = generate_db_names(",".join(data.columns.to_list())).split(",")
    db_cols = remove_newlines(db_cols)
    cols = data.columns.to_list()
    mappings = dict(zip(cols, db_cols))
    return mappings


def gen_schema(mappings, data):
    schema = []
    table_cols = data.columns.to_list()

    for col in table_cols:
        is_int = is_integer_dtype(data[col])
        is_float = is_float_dtype(data[col])
        is_object = is_object_dtype(data[col])

        if is_float:
            schema.append([mappings[col], "float8"])
        if is_int:
            schema.append([mappings[col], "int8"])
        if is_object:
            schema.append([mappings[col], "text"])

    dict_schema = dict(schema)
    return dict_schema


def gen_table_query(table_name, schema):
    columns = ", ".join([f"{col} {dtype}" for col, dtype in schema.items()])
    create_table_query = f"""
    CREATE TABLE IF NOT EXISTS {table_name} (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    {columns},
    UNIQUE(code)
    )
    """
    return create_table_query
