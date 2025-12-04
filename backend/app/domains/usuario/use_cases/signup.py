from typing import Dict, Any
from fastapi import HTTPException


class SignupUseCase:
    def __init__(self, usuario_repository, denunciante_repository):
        self.usuario_repository = usuario_repository
        self.denunciante_repository = denunciante_repository

    def execute(self, cpf: str, nome: str, senha: str, email: str) -> Dict[Any, Any]:
        existing_user = self.usuario_repository.find_by_email(email)
        
        if existing_user:
            raise HTTPException(status_code=409, detail="Email já cadastrado")
        
        usuario = self.usuario_repository.create(cpf, nome, senha, email)
        self.denunciante_repository.create(cpf)
        return dict(usuario)
