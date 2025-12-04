from fastapi import HTTPException

from app.domains.totem.use_cases.create_totem import CreateTotemUseCase
from app.domains.totem.use_cases.delete_totem import DeleteTotemUseCase
from app.domains.totem.use_cases.get_all_totems import GetAllTotemsUseCase
from app.domains.totem.use_cases.get_totem import GetTotemUseCase
from app.domains.totem.use_cases.verify_distance import VerifyDistanceUseCase


class TotemController:
    def __init__(self, totem_repository):
        self.get_totem_use_case = GetTotemUseCase(totem_repository)
        self.verify_distance_use_case = VerifyDistanceUseCase(totem_repository)
        self.get_all_totems_use_case = GetAllTotemsUseCase(totem_repository)
        self.create_totem_use_case = CreateTotemUseCase(totem_repository)
        self.delete_totem_use_case = DeleteTotemUseCase(totem_repository)

    def get_totem(self, numero_serie: str):
        totem = self.get_totem_use_case.execute(numero_serie)
        if not totem:
            raise HTTPException(status_code=404, detail="Totem não encontrado")
        return totem

    def verify_distance(self, numero_serie: str, latitude: float, longitude: float):
        result = self.verify_distance_use_case.execute(
            numero_serie, latitude, longitude
        )
        return result

    def get_all_totems(self):
        return self.get_all_totems_use_case.execute()

    def create_totem(
        self,
        numero_serie: str,
        nome_cidade: str,
        estado: str,
        coordenadas: str,
        status: str,
        data_instalacao: str,
    ):
        return self.create_totem_use_case.execute(
            numero_serie, nome_cidade, estado, coordenadas, status, data_instalacao
        )

    def delete_totem(self, numero_serie: str):
        deleted = self.delete_totem_use_case.execute(numero_serie)
        if not deleted:
            raise HTTPException(status_code=404, detail="Totem não encontrado")
        return {"message": "Totem deletado com sucesso"}
