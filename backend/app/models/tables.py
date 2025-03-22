import uuid
from app import db
from sqlalchemy.dialects.postgresql import UUID


class Table(db.Model):
    __tablename__ = "tables"

    id = db.Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
    )
    name = db.Column(db.Text, nullable=False)
    dbname = db.Column(db.Text, nullable=False)
    valid = db.Column(db.Boolean, default=False, nullable=False)

    def __repr__(self):
        return f"<Table {self.name}>"
