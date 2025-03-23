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
        UUID(as_uuid=True), db.ForeignKey("tables.id"), unique=False, nullable=False
    )

    table = db.relationship("TableName", backref=db.backref("mapping", uselist=False))

    def to_dict(self):
        return {
            "id": self.id,
            "table_id": self.table_id,
            "db_name": self.db_name,
            "name": self.name,
        }
