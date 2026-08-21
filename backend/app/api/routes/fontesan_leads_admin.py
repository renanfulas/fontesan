from fastapi import APIRouter, Depends, Request

from app.api.schemas.fontesan_leads import FontesanLeadListResponse
from app.core.security import verify_api_key
from app.fontesan_leads.service import FontesanLeadService

router = APIRouter()


@router.get("", response_model=FontesanLeadListResponse)
def list_fontesan_leads(
    request: Request,
    _: str = Depends(verify_api_key),
) -> FontesanLeadListResponse:
    return FontesanLeadService(request.app.state.database_runtime).list_leads()
