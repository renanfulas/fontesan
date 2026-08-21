from typing import Literal

from pydantic import BaseModel, Field, field_validator

FontesanBusinessType = Literal[
    "Padaria",
    "Restaurante ou cozinha",
    "Mercado ou hortifrúti",
    "Outro",
]
_ALLOWED_BUSINESS_TYPES = frozenset(
    {"Padaria", "Restaurante ou cozinha", "Mercado ou hortifrúti", "Outro"}
)


def safe_business_type(value: object) -> FontesanBusinessType:
    if not isinstance(value, str):
        return "Outro"
    normalized = value.strip()
    if normalized in _ALLOWED_BUSINESS_TYPES:
        return normalized
    return "Outro"


class FontesanLeadRequest(BaseModel):
    nome: str = Field(min_length=1, max_length=120)
    tipo_negocio: FontesanBusinessType = "Outro"
    telefone: str = Field(min_length=1, max_length=40)
    mensagem: str | None = Field(default=None, max_length=2000)
    # Honeypot field mirrored from the site's form. Real visitors never fill
    # it; a non-empty value means a bot submitted the form.
    site: str | None = Field(default=None, max_length=200)

    @field_validator("nome", "telefone", mode="before")
    @classmethod
    def normalize_required_text(cls, value: object) -> object:
        if not isinstance(value, str):
            return value
        normalized = " ".join(value.split())
        if not normalized:
            raise ValueError("field cannot be blank")
        return normalized

    @field_validator("mensagem", "site", mode="before")
    @classmethod
    def normalize_optional_text(cls, value: str | None) -> str | None:
        if value is None:
            return None
        if not isinstance(value, str):
            return value
        normalized = value.strip()
        return normalized or None

    @field_validator("tipo_negocio", mode="before")
    @classmethod
    def normalize_business_type(cls, value: object) -> str:
        if not isinstance(value, str) or not value.strip():
            raise ValueError("tipo_negocio cannot be blank")
        return safe_business_type(value)


class FontesanLeadResponse(BaseModel):
    lead_id: str
    accepted: bool
    status: str
    storage: str
