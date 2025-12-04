from app.domains.denuncia.use_cases.create_denuncia import CreateDenunciaUseCase
from app.domains.denuncia.use_cases.get_denuncias_by_area import GetDenunciasByAreaUseCase
from app.domains.denuncia.use_cases.get_metrics_by_department import GetMetricsByDepartmentUseCase
from app.domains.denuncia.use_cases.get_most_recent_by_city import GetMostRecentByCityUseCase
from app.domains.denuncia.use_cases.update_status import UpdateStatusUseCase

class DenunciaController:
    def __init__(self, denuncia_repository, denunciante_repository=None):
        self.create_denuncia_use_case = CreateDenunciaUseCase(denuncia_repository)
        self.get_denuncias_by_area_use_case = GetDenunciasByAreaUseCase(denuncia_repository)
        self.get_metrics_by_department_use_case = GetMetricsByDepartmentUseCase(denuncia_repository)
        self.get_most_recent_by_city_use_case = GetMostRecentByCityUseCase(denuncia_repository)
        self.update_status_use_case = UpdateStatusUseCase(denuncia_repository, denunciante_repository)

    def create_denuncia(self, userid: str, category: str, content: str, totem: str, coordenadas: str, image: str = None):
        return self.create_denuncia_use_case.execute(userid, category, content, totem, coordenadas, image)

    def get_denuncias_by_area(self, latitude: float, longitude: float, raio: float, categoria: str = None):
        return self.get_denuncias_by_area_use_case.execute(latitude, longitude, raio, categoria)

    def get_metrics_by_department(self):
        return self.get_metrics_by_department_use_case.execute()

    def get_most_recent_by_city(self, nome_cidade: str, sigla_estado: str):
        return self.get_most_recent_by_city_use_case.execute(nome_cidade, sigla_estado)

    def update_status(self, usuario: str, data: str, coordenadas: str, novo_status: str, matricula_funcionario: str):
        return self.update_status_use_case.execute(usuario, data, coordenadas, novo_status, matricula_funcionario)
