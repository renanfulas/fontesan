import logging

from fastapi import APIRouter, HTTPException, Request

from app.api.schemas.fontesan_leads import FontesanLeadRequest, FontesanLeadResponse
from app.core.errors import DatabaseUnavailableError
from app.core.logging import log_event
from app.core.request_context import get_request_id
from app.fontesan_leads.service import FontesanLeadService

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("", response_model=FontesanLeadResponse)
def create_fontesan_lead(
    payload: FontesanLeadRequest,
    request: Request,
) -> FontesanLeadResponse:
    if payload.site:
        # Honeypot tripped: pretend success without touching the database, so
        # the bot gets no signal that it was caught.
        from uuid import uuid4

        return FontesanLeadResponse(
            lead_id=str(uuid4()),
            accepted=True,
            status="accepted",
            storage="rejected_honeypot",
        )

    try:
        response = FontesanLeadService(request.app.state.database_runtime).record(payload)
    except DatabaseUnavailableError as exc:
        raise HTTPException(status_code=503, detail="fontesan_lead_storage_unavailable") from exc

    log_event(
        logger,
        "fontesan_lead_recorded",
        request_id=get_request_id(request),
        tipo_negocio=payload.tipo_negocio,
        mensagem_present=payload.mensagem is not None,
        storage=response.storage,
    )
    return response
