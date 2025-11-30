from fastapi import HTTPException
from app.domains.totem.use_cases.get_totem import GetTotemUseCase
from app.domains.totem.use_cases.verify_distance import VerifyDistanceUseCase

class TotemController:
    def __init__(self, totem_repository):
        self.get_totem_use_case = GetTotemUseCase(totem_repository)
        self.verify_distance_use_case = VerifyDistanceUseCase(totem_repository)

    def get_totem(self, numero_serie: str):
        totem = self.get_totem_use_case.execute(numero_serie)
        if not totem:
            raise HTTPException(status_code=404, detail="Totem não encontrado")
        return totem

    def verify_distance(self, numero_serie: str, latitude: float, longitude: float):
        result = self.verify_distance_use_case.execute(numero_serie, latitude, longitude)
        return result