from typing import Optional, Dict, Any
from math import radians, sin, cos, sqrt, atan2

class GetTotemUseCase:
    def __init__(self, totem_repository):
        self.totem_repository = totem_repository

    def execute(self, numero_serie: str) -> Optional[Dict[Any, Any]]:
        totem = self.totem_repository.find_by_id(numero_serie)
        return dict(totem)
