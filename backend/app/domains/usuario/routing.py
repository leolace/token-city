from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.database import get_db_connection
from app.domains.usuario.repository import UsuarioRepository
from app.domains.denunciante.repository import DenuncianteRepository
from app.domains.usuario.controller import UsuarioController

router = APIRouter(prefix="/user", tags=["usuario"])

class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    cpf: str
    name: str
    password: str
    email: str

@router.post("/login")
def login(request: LoginRequest, conn=Depends(get_db_connection)):
    usuario_repository = UsuarioRepository(conn)
    denunciante_repository = DenuncianteRepository(conn)
    controller = UsuarioController(usuario_repository, denunciante_repository)
    return controller.login(request.email, request.password)

@router.post("/signup")
def signup(request: SignupRequest, conn=Depends(get_db_connection)):
    usuario_repository = UsuarioRepository(conn)
    denunciante_repository = DenuncianteRepository(conn)
    controller = UsuarioController(usuario_repository, denunciante_repository)
    return controller.signup(request.cpf, request.name, request.password, request.email)

@router.get("/top")
def get_top_denunciante(conn=Depends(get_db_connection)):
    usuario_repository = UsuarioRepository(conn)
    denunciante_repository = DenuncianteRepository(conn)
    controller = UsuarioController(usuario_repository, denunciante_repository)
    return controller.get_top_denunciante()
