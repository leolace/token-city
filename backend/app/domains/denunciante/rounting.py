
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.database import get_db_connection
from app.domains.usuario.repository import UsuarioRepository
from app.domains.denunciante.repository import DenuncianteRepository
from app.domains.denunciante.controller import DenuncianteController

router = APIRouter(prefix="/denunciante", tags=["denunciante"])

class GetCPF(BaseModel):
    cpf: str

@router.get("/profile")
def get_denunciante_profile(body: GetCPF, conn=Depends(get_db_connection)):
    denunciante_repository = DenuncianteRepository(conn)
    controller = DenuncianteController(denunciante_repository)
    
    return controller.get_denunciante_profile(body.cpf)