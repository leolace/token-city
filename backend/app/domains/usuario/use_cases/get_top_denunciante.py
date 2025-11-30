from typing import Dict, Any

class GetTopDenuncianteUseCase:
    def __init__(self, denunciante_repository):
        self.denunciante_repository = denunciante_repository

    def execute(self) -> Dict[str, Any]:
        denunciante = self.denunciante_repository.find_top_denunciante()
        if not denunciante:
            return None
        return {
            "nome": denunciante["nome"],
            "cpf": denunciante["cpf"],
            "saldoTokens": str(denunciante["saldo_tokens"])
        }
