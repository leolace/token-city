from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.database import get_db_connection
from app.domains.denunciante.repository import DenuncianteRepository
from app.domains.recompensa.controller import RecompensaController
from app.domains.recompensa.repository import RecompensaRepository

router = APIRouter(prefix="/recompensa", tags=["recompensa"])


class RedeemRequest(BaseModel):
    userId: str


class CreateRecompensaRequest(BaseModel):
    nome: str
    quantidade: int
    valor_token: float


@router.get("")
def list_recompensas(conn=Depends(get_db_connection)):
    recompensa_repository = RecompensaRepository(conn)
    denunciante_repository = DenuncianteRepository(conn)
    controller = RecompensaController(recompensa_repository, denunciante_repository)
    return controller.list_recompensas()


@router.post("/{rewardId}")
def redeem_recompensa(
    rewardId: str, request: RedeemRequest, conn=Depends(get_db_connection)
):
    recompensa_repository = RecompensaRepository(conn)
    denunciante_repository = DenuncianteRepository(conn)
    controller = RecompensaController(recompensa_repository, denunciante_repository)
    return controller.redeem_recompensa(request.userId, rewardId)


@router.post("", status_code=201)
def create_recompensa(
    request: CreateRecompensaRequest, conn=Depends(get_db_connection)
):
    recompensa_repository = RecompensaRepository(conn)
    denunciante_repository = DenuncianteRepository(conn)
    controller = RecompensaController(recompensa_repository, denunciante_repository)
    return controller.create_recompensa(
        request.nome, request.quantidade, request.valor_token
    )


@router.get("/count/resgates")
def count_resgates(conn=Depends(get_db_connection)):
    repository = RecompensaRepository(conn)
    count = repository.count_resgates()
    return {"count": count}


@router.get("/usuario/{usuario_cpf}")
def list_resgates_by_usuario(usuario_cpf: str, conn=Depends(get_db_connection)):
    recompensa_repository = RecompensaRepository(conn)
    denunciante_repository = DenuncianteRepository(conn)
    controller = RecompensaController(recompensa_repository, denunciante_repository)
    return controller.list_resgates_by_usuario(usuario_cpf)
