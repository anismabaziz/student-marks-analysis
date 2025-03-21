from app import create_app
from app.database.test_connection import test_connection

app = create_app()

if __name__ == "__main__":
    test_connection()
    app.run(port=3000, debug=True)
