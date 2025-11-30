from typing import List, Dict, Any

class GetMostRecentByCityUseCase:
    def __init__(self, denuncia_repository):
        self.denuncia_repository = denuncia_repository

    def execute(self, nome_cidade: str, sigla_estado: str) -> Dict[str, List[Dict[str, str]]]:
        denuncias = self.denuncia_repository.find_most_recent_by_city(nome_cidade, sigla_estado)
        return {
            "denuncias": [
                {
                    "nomeDenunciante": d["nomedenunciante"],
                    "descricao": d["descricao"],
                    "statusAtual": d["statusatual"],
                    "dataRegistro": str(d["dataregistro"])
                }
                for d in denuncias
            ]
        }
