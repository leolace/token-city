from typing import Dict, Any

class GetDenuncianteProfileUseCase:
    def __init__(self, denunciante_repository, usuario_repository):
        self.denunciante_repository = denunciante_repository

    def execute(self) -> Dict[str, Any]:
        denunciante = self.denunciante_repository.find_by_usuario()
        if not denunciante:
            return None
        return {
            "nome": denunciante["nome"],
            "cpf": denunciante["cpf"],
            "saldoTokens": str(denunciante["saldo_tokens"])
        }
