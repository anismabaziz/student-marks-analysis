from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy import MetaData


db = SQLAlchemy()
migrate = Migrate()
metadata = MetaData()
