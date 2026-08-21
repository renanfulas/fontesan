import pytest
from fastapi.testclient import TestClient

from app.core.config import get_settings
from app.main import create_app


@pytest.fixture
def client() -> TestClient:
    # A fresh app per test gives a fresh in-memory rate limiter, so tests in
    # this file do not trip each other's FONTESAN_LEADS_RATE_LIMIT_PER_MINUTE
    # budget (mirrors tests/test_web_chat.py's web_client fixture).
    return TestClient(create_app())


def test_create_lead_accepts_valid_payload(client: TestClient) -> None:
    response = client.post(
        "/web/fontesan/leads",
        json={
            "nome": "Ana Souza",
            "tipo_negocio": "Padaria",
            "telefone": "11999999999",
            "mensagem": "Recebi uma notificação e preciso de ajuda.",
        },
    )

    assert response.status_code == 200

    payload = response.json()
    assert payload["lead_id"]
    assert payload["accepted"] is True
    assert payload["status"] == "accepted"
    assert payload["storage"] == "pending_persistence"


def test_create_lead_accepts_without_optional_message(client: TestClient) -> None:
    response = client.post(
        "/web/fontesan/leads",
        json={
            "nome": "Carlos",
            "tipo_negocio": "Restaurante ou cozinha",
            "telefone": "(11) 94781-1422",
        },
    )

    assert response.status_code == 200
    assert response.json()["accepted"] is True


def test_create_lead_requires_nome(client: TestClient) -> None:
    response = client.post(
        "/web/fontesan/leads",
        json={
            "tipo_negocio": "Padaria",
            "telefone": "11999999999",
        },
    )

    assert response.status_code == 422


def test_create_lead_requires_telefone(client: TestClient) -> None:
    response = client.post(
        "/web/fontesan/leads",
        json={
            "nome": "Ana",
            "tipo_negocio": "Padaria",
        },
    )

    assert response.status_code == 422


def test_create_lead_rejects_blank_nome(client: TestClient) -> None:
    response = client.post(
        "/web/fontesan/leads",
        json={
            "nome": "   ",
            "tipo_negocio": "Padaria",
            "telefone": "11999999999",
        },
    )

    assert response.status_code == 422


def test_create_lead_normalizes_whitespace_and_unknown_business_type(
    client: TestClient,
) -> None:
    response = client.post(
        "/web/fontesan/leads",
        json={
            "nome": "  Ana   Souza  ",
            "tipo_negocio": "Padaria de bairro",
            "telefone": "  11 99999-9999  ",
            "mensagem": "   ",
        },
    )

    assert response.status_code == 200
    assert response.json()["accepted"] is True


def test_create_lead_rejects_oversized_message(client: TestClient) -> None:
    response = client.post(
        "/web/fontesan/leads",
        json={
            "nome": "Ana",
            "tipo_negocio": "Padaria",
            "telefone": "11999999999",
            "mensagem": "x" * 2001,
        },
    )

    assert response.status_code == 422


def test_create_lead_honeypot_reports_success_without_persisting(
    client: TestClient,
) -> None:
    response = client.post(
        "/web/fontesan/leads",
        json={
            "nome": "Bot",
            "tipo_negocio": "Padaria",
            "telefone": "11999999999",
            "site": "https://spam.example",
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["accepted"] is True
    assert payload["storage"] == "rejected_honeypot"


def test_create_lead_does_not_require_api_key(client: TestClient) -> None:
    response = client.post(
        "/web/fontesan/leads",
        json={
            "nome": "Ana",
            "tipo_negocio": "Padaria",
            "telefone": "11999999999",
        },
    )

    assert response.status_code != 401
    assert response.status_code != 403


def test_fontesan_leads_rate_limit_returns_429_with_retry_after(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setenv("FONTESAN_LEADS_RATE_LIMIT_PER_MINUTE", "1")
    get_settings.cache_clear()
    try:
        scoped_client = TestClient(create_app())
        payload = {
            "nome": "Ana",
            "tipo_negocio": "Padaria",
            "telefone": "11999999999",
        }

        first = scoped_client.post("/web/fontesan/leads", json=payload)
        assert first.status_code == 200

        second = scoped_client.post("/web/fontesan/leads", json=payload)
        assert second.status_code == 429
        assert "Retry-After" in second.headers
    finally:
        get_settings.cache_clear()
