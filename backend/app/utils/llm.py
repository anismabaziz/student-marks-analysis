from google import genai
from google.genai import errors as genai_errors
from app.config.settings import Config
from app.genai.sys_prompts import gen_titles_prompt, prepare_titles_prompt

client = genai.Client(api_key=Config.GOOGLE_API_KEY)


def _generate_with_fallback(contents, system_instruction):
    primary_model = Config.GEMINI_MODEL
    fallback_models = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
    ]

    model_candidates = [primary_model]
    for model in fallback_models:
        if model not in model_candidates:
            model_candidates.append(model)

    last_error = None
    for model in model_candidates:
        try:
            response = client.models.generate_content(
                model=model,
                config=genai.types.GenerateContentConfig(
                    system_instruction=system_instruction
                ),
                contents=[contents],
            )
            return response.text
        except genai_errors.ClientError as exc:
            if getattr(exc, "code", None) == 429:
                last_error = exc
                continue
            raise

    if last_error is not None:
        raise last_error

    raise RuntimeError("No Gemini model candidates available")


def generate_titles(titles):
    return _generate_with_fallback(titles, gen_titles_prompt)


def generate_db_names(names):
    return _generate_with_fallback(names, prepare_titles_prompt)
