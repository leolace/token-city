from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.database import get_db_connection
from app.domains.recompensa.repository import RecompensaRepository
from app.domains.denunciante.repository import DenuncianteRepository
from app.domains.recompensa.controller import RecompensaController

router = APIRouter(prefix="/recompensa", tags=["recompensa"])

class RedeemRequest(BaseModel):
    userId: str

@router.get("")
def list_recompensas(conn=Depends(get_db_connection)):
    recompensa_repository = RecompensaRepository(conn)
    denunciante_repository = DenuncianteRepository(conn)
    controller = RecompensaController(recompensa_repository, denunciante_repository)
    return controller.list_recompensas()

@router.post("/{rewardId}")
def redeem_recompensa(rewardId: str, request: RedeemRequest, conn=Depends(get_db_connection)):
    recompensa_repository = RecompensaRepository(conn)
    denunciante_repository = DenuncianteRepository(conn)
    controller = RecompensaController(recompensa_repository, denunciante_repository)
    return controller.redeem_recompensa(request.userId, rewardId)

@router.get("/count/resgates")
def count_resgates(conn=Depends(get_db_connection)):
    repository = RecompensaRepository(conn)
    count = repository.count_resgates()
    return {"count": count}
