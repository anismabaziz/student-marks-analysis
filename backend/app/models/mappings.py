import uuid
from app import db
from sqlalchemy.dialects.postgresql import UUID


class Mapping(db.Model):
    __tablename__ = "mappings"

    id = db.Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
    )
    db_name = db.Column(db.Text, nullable=False)
    name = db.Column(db.Text, nullable=False)
    table_id = db.Column(
        UUID(as_uuid=True), db.ForeignKey("tables.id"), unique=True, nullable=False
    )

    # Relationships (optional, but useful)
    base = db.relationship("Base", backref=db.backref("mapping", uselist=False))
    table = db.relationship("Table", backref=db.backref("mapping", uselist=False))
