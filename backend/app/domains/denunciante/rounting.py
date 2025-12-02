from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.database import get_db_connection
from app.domains.denunciante.controller import DenuncianteController
from app.domains.denunciante.repository import DenuncianteRepository
from app.domains.usuario.repository import UsuarioRepository

router = APIRouter(prefix="/denunciante", tags=["denunciante"])


@router.get("/profile/{cpf}")
def get_denunciante_profile(cpf: str, conn=Depends(get_db_connection)):
    denunciante_repository = DenuncianteRepository(conn)
    controller = DenuncianteController(denunciante_repository)

    return controller.get_denunciante_profile(cpf)


@router.get("/top")
def get_top_denunciante(conn=Depends(get_db_connection)):
    denunciante_repository = DenuncianteRepository(conn)
    controller = DenuncianteController(denunciante_repository)

    return controller.get_top_denunciante()
