import re


def extract_name(text):
    if text:
        text = re.sub(r"^\d+\s*-\s*", "", text.strip())
    return text
