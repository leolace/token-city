from typing import Dict, List


class GetMostRecentByCityUseCase:
    def __init__(self, denuncia_repository):
        self.denuncia_repository = denuncia_repository

    def execute(
        self, nome_cidade: str, sigla_estado: str
    ) -> Dict[str, List[Dict[str, str]]]:
        denuncias = self.denuncia_repository.find_most_recent_by_city(
            nome_cidade, sigla_estado
        )
        return {"denuncias": denuncias}
