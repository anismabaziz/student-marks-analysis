from google import genai
from app.config.settings import Config
from app.genai.sys_prompts import gen_titles_prompt, prepare_titles_prompt

client = genai.Client(api_key=Config.GOOGLE_API_KEY)


def generate_titles(titles):
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        config=genai.types.GenerateContentConfig(system_instruction=gen_titles_prompt),
        contents=[titles],
    )
    return response.text


def generate_db_names(names):
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        config=genai.types.GenerateContentConfig(
            system_instruction=prepare_titles_prompt
        ),
        contents=[names],
    )
    return response.text
