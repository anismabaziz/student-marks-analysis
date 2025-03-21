from database.db import SessionLocal
from sqlalchemy import text


class SchemaService:
    @staticmethod
    def create_schema():
        sql = """
        CREATE TABLE IF NOT EXISTS mappings (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT,
        db_name TEXT,
        table_name TEXT
        );
        """
        session = SessionLocal()
        try:
            session.execute(text(sql))
            session.commit()
            print("✅ Schema created successfully!")
        except Exception as e:
            session.rollback()
            print(f"❌ Failed to create schema: {e}")
        finally:
            session.close()
