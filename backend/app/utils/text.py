from bidi.algorithm import get_display
import arabic_reshaper
import unicodedata


def fix_text_order(text):
    lines = text.strip().split("\n")
    corrected_text = " ".join(lines).strip()
    return corrected_text


def reshape_arabic(text):
    try:
        return get_display(arabic_reshaper.reshape(text)) if text else text
    except Exception:
        return text


def remove_newlines(text_list):
    for i in range(len(text_list)):
        text_list[i] = text_list[i].replace("\n", "")
    return text_list


def replace_french_e(text):
    normalized_text = unicodedata.normalize("NFD", text)
    transformed_text = "".join(
        char for char in normalized_text if not unicodedata.combining(char)
    )
    return transformed_text
