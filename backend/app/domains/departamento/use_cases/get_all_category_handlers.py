from typing import List, Dict, Any

class GetAllCategoryHandlersUseCase:
    def __init__(self, departamento_repository):
        self.departamento_repository = departamento_repository

    def execute(self) -> Dict[str, List[Dict[str, str]]]:
        departamentos = self.departamento_repository.find_all_category_handlers()
        return {
            "departamentos": [
                {
                    "nome": d["nome"],
                    "sigla": d["sigla"]
                }
                for d in departamentos
            ]
        }
