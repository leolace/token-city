from typing import Optional, Dict, Any

class LoginUseCase:
    def __init__(self, usuario_repository):
        self.usuario_repository = usuario_repository

    def execute(self, email: str, senha: str) -> Optional[Dict[str, str]]:
        usuario = self.usuario_repository.find_by_email_and_password(email, senha)
        if not usuario:
            return None
        return usuario
