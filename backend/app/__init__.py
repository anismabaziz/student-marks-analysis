from flask import Flask
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    CORS(app)

    from .routes.health import health_bp
    from .routes.students import students_bp
    from .routes.stats import stats_bp

    app.register_blueprint(health_bp)
    app.register_blueprint(students_bp)
    app.register_blueprint(stats_bp)

    return app
