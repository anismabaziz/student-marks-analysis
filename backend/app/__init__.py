from flask import Flask
from flask_cors import CORS
from app.config.settings import Config
from .extensions import db, migrate


def create_app():
    app = Flask(__name__)
    CORS(app)

    from .models.tables import Table
    from .models.mappings import Mapping

    app.config.from_object(Config)
    db.init_app(app)
    migrate.init_app(app, db)

    from .routes.health import health_bp
    from .routes.students import students_bp
    from .routes.stats import stats_bp
    from .routes.pdf import pdf_bp

    app.register_blueprint(health_bp)
    app.register_blueprint(students_bp)
    app.register_blueprint(stats_bp)
    app.register_blueprint(pdf_bp)

    return app
