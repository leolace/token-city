from fastapi import HTTPException
from app.domains.usuario.use_cases.login import LoginUseCase
from app.domains.usuario.use_cases.signup import SignupUseCase
from app.domains.usuario.use_cases.get_top_denunciante import GetTopDenuncianteUseCase
from app.domains.usuario.use_cases.get_denunciante_profile import GetDenuncianteProfileUseCase

class UsuarioController:
    def __init__(self, usuario_repository, denunciante_repository):
        self.login_use_case = LoginUseCase(usuario_repository)
        self.signup_use_case = SignupUseCase(usuario_repository, denunciante_repository)
        self.get_top_denunciante_use_case = GetTopDenuncianteUseCase(denunciante_repository)
        self.get_denunciante_profile =  GetDenuncianteProfileUseCase()

    def login(self, email: str, senha: str):
        usuario = self.login_use_case.execute(email, senha)
        if not usuario:
            raise HTTPException(status_code=401, detail="Credenciais inválidas")
        return usuario

    def signup(self, cpf: str, nome: str, senha: str, email: str):
        try:
            usuario = self.signup_use_case.execute(cpf, nome, senha, email)
            return usuario
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    def get_top_denunciante(self):
        result = self.get_top_denunciante_use_case.execute()
        if not result:
            raise HTTPException(status_code=404, detail="Nenhum denunciante encontrado")
        return result
    def  get_denunciante_profile(self):
        result = self.get_top_denunciante_use_case.execute()
        if not result:
            raise HTTPException(status_code=404, detail="Nenhum denunciante encontrado")
        return result
