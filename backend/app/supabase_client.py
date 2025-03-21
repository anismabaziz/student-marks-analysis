from supabase import create_client, Client
from .config.settings import Config

supabase: Client = create_client(Config.SUPABASE_URL, Config.SUPABASE_KEY)
