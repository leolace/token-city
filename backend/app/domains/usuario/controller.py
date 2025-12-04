from fastapi import HTTPException

from app.domains.usuario.use_cases.get_denunciante_profile import (
    GetDenuncianteProfileUseCase,
)
from app.domains.usuario.use_cases.login import LoginUseCase, LoginAdminUseCase
from app.domains.usuario.use_cases.login_operador import LoginOperadorUseCase
from app.domains.usuario.use_cases.signup import SignupUseCase


class UsuarioController:
    def __init__(self, usuario_repository, denunciante_repository):
        self.login_use_case = LoginUseCase(usuario_repository)
        self.login_operador_use_case = LoginOperadorUseCase(usuario_repository)
        self.login_admin_use_case = LoginAdminUseCase(usuario_repository)
        self.signup_use_case = SignupUseCase(usuario_repository, denunciante_repository)
        self.get_denunciante_profile = GetDenuncianteProfileUseCase(
            denunciante_repository, usuario_repository
        )

    def login(self, email: str, senha: str):
        usuario = self.login_use_case.execute(email, senha)
        if not usuario:
            raise HTTPException(status_code=401, detail="Credenciais inválidas")
        return usuario

    def login_operador(self, matricula: str, senha: str):
        usuario = self.login_operador_use_case.execute(matricula, senha)
        if not usuario:
            raise HTTPException(status_code=401, detail="Matrícula ou senha inválida")
        return usuario

    def login_admin(self, matricula: str, senha: str):
        usuario = self.login_admin_use_case.execute(matricula, senha)
        if not usuario:
            raise HTTPException(status_code=401, detail="Matrícula ou senha inválida ou usuário não é administrador")
        return usuario

    def signup(self, cpf: str, nome: str, senha: str, email: str):
        try:
            usuario = self.signup_use_case.execute(cpf, nome, senha, email)
            return usuario
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    def get_denunciante_profile(self):
        result = self.get_denunciante_profile.execute()
        if not result:
            raise HTTPException(status_code=404, detail="Nenhum denunciante encontrado")
        return result
