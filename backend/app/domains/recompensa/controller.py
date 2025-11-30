from fastapi import HTTPException
from app.domains.recompensa.use_cases.list_recompensas import ListRecompensasUseCase
from app.domains.recompensa.use_cases.redeem_recompensa import RedeemRecompensaUseCase

class RecompensaController:
    def __init__(self, recompensa_repository, denunciante_repository):
        self.list_recompensas_use_case = ListRecompensasUseCase(recompensa_repository)
        self.redeem_recompensa_use_case = RedeemRecompensaUseCase(recompensa_repository, denunciante_repository)

    def list_recompensas(self):
        return self.list_recompensas_use_case.execute()

    def redeem_recompensa(self, usuario_cpf: str, recompensa_nome: str):
        try:
            return self.redeem_recompensa_use_case.execute(usuario_cpf, recompensa_nome)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
