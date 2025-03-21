from database.db import engine


def test_connection():
    try:
        with engine.connect() as connection:
            print("✅ Connection successful!")
    except Exception as e:
        print(f"❌ Failed to connect: {e}")


if __name__ == "__main__":
    test_connection()
