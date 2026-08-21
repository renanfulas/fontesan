from app.api.schemas.fontesan_leads import FontesanLeadRequest, FontesanLeadResponse
from app.db.operational import OperationalRepository
from app.db.runtime import DatabaseRuntime


class FontesanLeadService:
    def __init__(self, runtime: DatabaseRuntime | None = None) -> None:
        self.runtime = runtime

    def record(self, lead: FontesanLeadRequest) -> FontesanLeadResponse:
        if self.runtime is None:
            from uuid import uuid4

            return FontesanLeadResponse(
                lead_id=str(uuid4()),
                accepted=True,
                status="accepted",
                storage="pending_persistence",
            )
        return OperationalRepository(self.runtime).record_fontesan_lead(lead)
