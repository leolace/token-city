from typing import List, Dict, Any

class ListRecompensasUseCase:
    def __init__(self, recompensa_repository):
        self.recompensa_repository = recompensa_repository

    def execute(self) -> List[Dict[Any, Any]]:
        recompensas = self.recompensa_repository.find_all()
        return [dict(r) for r in recompensas]
