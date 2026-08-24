from typing import Literal

from pydantic import BaseModel, Field, field_validator

# Texto de consentimento gravado em fontesan_leads.consent_text quando
# consent_given=True (migration 021). O checkbox em site/index.html mostra
# este mesmo texto ao usuário -- qualquer mudança aqui precisa ser replicada
# lá, e vice-versa, senão o registro deixa de refletir o que foi consentido.
FONTESAN_LEAD_CONSENT_TEXT_V1 = (
    "Autorizo a Fontesan a usar meu nome, telefone e mensagem para me "
    "responder sobre o diagnóstico solicitado, conforme a Política de "
    "Privacidade (fontesan.com.br/privacidade/)."
)

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

    # Atribuicao (Onda 0, migration 021). Todos opcionais: o site ainda nao
    # atualizado continua funcionando sem eles. consent_ip/consent_at nao
    # entram aqui -- sao derivados no backend (IP da requisicao, timestamp do
    # servidor), nunca aceitos do cliente.
    consent_given: bool = False
    origem: str | None = Field(default=None, max_length=120)
    origem_url: str | None = Field(default=None, max_length=500)
    utm_source: str | None = Field(default=None, max_length=120)
    utm_medium: str | None = Field(default=None, max_length=120)
    utm_campaign: str | None = Field(default=None, max_length=120)
    utm_term: str | None = Field(default=None, max_length=120)
    utm_content: str | None = Field(default=None, max_length=120)
    gclid: str | None = Field(default=None, max_length=200)
    gbraid: str | None = Field(default=None, max_length=200)
    wbraid: str | None = Field(default=None, max_length=200)
    fbclid: str | None = Field(default=None, max_length=200)
    fbp: str | None = Field(default=None, max_length=200)
    fbc: str | None = Field(default=None, max_length=200)
    landing_path: str | None = Field(default=None, max_length=300)
    referrer: str | None = Field(default=None, max_length=500)
    partner_slug: str | None = Field(default=None, max_length=120)

    @field_validator(
        "origem",
        "origem_url",
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
        "gclid",
        "gbraid",
        "wbraid",
        "fbclid",
        "fbp",
        "fbc",
        "landing_path",
        "referrer",
        "partner_slug",
        mode="before",
    )
    @classmethod
    def normalize_attribution_text(cls, value: str | None) -> str | None:
        if value is None:
            return None
        if not isinstance(value, str):
            return value
        normalized = value.strip()
        return normalized or None

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


class FontesanLeadRecord(BaseModel):
    lead_id: str
    nome: str
    tipo_negocio: str
    telefone: str
    mensagem: str | None
    created_at: str


class FontesanLeadListResponse(BaseModel):
    leads: list[FontesanLeadRecord]
