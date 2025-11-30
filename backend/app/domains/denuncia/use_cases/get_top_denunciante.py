from typing import Dict, Any

class GetTopDenuncianteUseCase:
    def __init__(self, denuncia_repository):
        self.denuncia_repository = denuncia_repository

    def execute(self) -> Dict[str, Any]:
        denunciante = self.denuncia_repository.find_top_denunciante()
        if not denunciante:
            return None
        return {
            "nome": denunciante["nome"],
            "cpf": denunciante["cpf"],
            "saldoTokens": str(denunciante["saldo_tokens"])
        }
