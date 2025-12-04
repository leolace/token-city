from typing import Any, Dict, List


class ListResgatesByUsuarioUseCase:
    def __init__(self, recompensa_repository):
        self.recompensa_repository = recompensa_repository

    def execute(self, usuario_cpf: str) -> List[Dict[Any, Any]]:
        resgates = self.recompensa_repository.find_resgates_by_usuario(usuario_cpf)
        return [dict(r) for r in resgates]
