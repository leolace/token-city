from typing import Optional, Dict, Any

class LoginOperadorUseCase:
    def __init__(self, usuario_repository):
        self.usuario_repository = usuario_repository

    def execute(self, matricula: str, senha: str) -> Optional[Dict[str, str]]:
        usuario = self.usuario_repository.find_by_matricula_and_password(matricula, senha)
        if not usuario:
            return None
        return usuario
