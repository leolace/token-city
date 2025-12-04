from typing import Any, Dict, List


class GetDenunciasByAreaUseCase:
    def __init__(self, denuncia_repository):
        self.denuncia_repository = denuncia_repository

    def execute(
        self, latitude: float, longitude: float, raio: float, categoria: str = None
    ) -> Dict[str, List[Dict[Any, Any]]]:
        denuncias = self.denuncia_repository.find_by_area_and_status(
            latitude, longitude, raio, categoria
        )
        return {
            "denuncias": [
                {
                    "descricao": d["descricao"],
                    "coordenadas": d["coordenadas"],
                    "status": d["status"],
                    "data": str(d["data_registro"]),
                    "nomeUsuario": d["nome_usuario_denunciante"],
                    "cpf": d["cpf_usuario_denunciante"],
                    "categoria": d["categoria"],
                }
                for d in denuncias
            ]
        }
