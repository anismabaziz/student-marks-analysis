from flask import Flask
from flask_cors import CORS
from app.config.settings import Config
from .extensions import db, migrate, metadata
from flasgger import Swagger


def create_app():
    app = Flask(__name__)
    CORS(app)

    _swagger = Swagger(app, template_file="swagger_config.json")

    from .models.tables import TableName
    from .models.mappings import Mapping

    app.config.from_object(Config)
    db.init_app(app)
    migrate.init_app(app, db)

    with app.app_context():
        metadata.reflect(bind=db.engine)

    from .routes.health import health_bp
    from .routes.students import students_bp
    from .routes.stats import stats_bp
    from .routes.pdf import pdf_bp
    from .routes.tables import tables_bp
    from .routes.mappings import mappings_bp

    app.register_blueprint(health_bp)
    app.register_blueprint(students_bp)
    app.register_blueprint(stats_bp)
    app.register_blueprint(pdf_bp)
    app.register_blueprint(tables_bp)
    app.register_blueprint(mappings_bp)

    return app
