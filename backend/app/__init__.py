from flask import Flask
from flask_cors import CORS
from app.config.settings import Config


def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config.from_object(Config)

    from .routes.health import health_bp

    from .routes.students import students_bp

    from .routes.stats import stats_bp
    from .routes.pdf import pdf_bp
    from .routes.tables import tables_bp
    from .routes.mappings import mappings_bp
    from .routes.api_keys import keys_bp

    app.register_blueprint(health_bp)
    app.register_blueprint(students_bp)
    app.register_blueprint(stats_bp)
    app.register_blueprint(pdf_bp)
    app.register_blueprint(tables_bp)
    app.register_blueprint(mappings_bp)
    app.register_blueprint(keys_bp)

    return app
