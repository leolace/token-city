from fastapi import HTTPException

from app.domains.recompensa.use_cases.create_recompensa import CreateRecompensaUseCase
from app.domains.recompensa.use_cases.list_recompensas import ListRecompensasUseCase
from app.domains.recompensa.use_cases.list_resgates_by_usuario import (
    ListResgatesByUsuarioUseCase,
)
from app.domains.recompensa.use_cases.redeem_recompensa import RedeemRecompensaUseCase


class RecompensaController:
    def __init__(self, recompensa_repository, denunciante_repository):
        self.list_recompensas_use_case = ListRecompensasUseCase(recompensa_repository)
        self.redeem_recompensa_use_case = RedeemRecompensaUseCase(
            recompensa_repository, denunciante_repository
        )
        self.create_recompensa_use_case = CreateRecompensaUseCase(recompensa_repository)
        self.list_resgates_by_usuario_use_case = ListResgatesByUsuarioUseCase(
            recompensa_repository
        )

    def list_recompensas(self):
        return self.list_recompensas_use_case.execute()

    def redeem_recompensa(self, usuario_cpf: str, recompensa_nome: str):
        try:
            return self.redeem_recompensa_use_case.execute(usuario_cpf, recompensa_nome)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    def list_resgates_by_usuario(self, usuario_cpf: str):
        return self.list_resgates_by_usuario_use_case.execute(usuario_cpf)

    def create_recompensa(self, nome: str, quantidade: int, valor_token: float):
        try:
            return self.create_recompensa_use_case.execute(
                nome, quantidade, valor_token
            )
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
