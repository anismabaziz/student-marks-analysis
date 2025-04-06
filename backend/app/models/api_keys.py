import uuid
from app import db
from sqlalchemy.dialects.postgresql import UUID
import secrets
import datetime


class APIKey(db.Model):
    __tablename__ = "api_keys"

    id = db.Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
    )
    key = db.Column(db.String(64), unique=True, nullable=False)
    name = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

    def __init__(self, name):
        self.name = name
        self.key = self.generate_key()

    @staticmethod
    def generate_key():
        return secrets.token_hex(32)

    def to_dict(self):
        return {
            "id": self.id,
            "key": self.key,
            "name": self.name,
            "created_at": self.created_at,
            "is_active": self.is_active,
        }
