from typing import List, Dict, Any

class GetMetricsByDepartmentUseCase:
    def __init__(self, denuncia_repository):
        self.denuncia_repository = denuncia_repository

    def execute(self) -> Dict[str, List[Dict[str, Any]]]:
        metrics = self.denuncia_repository.get_metrics_by_department()
        return {
            "departamentos": [
                {
                    "siglaDepartamento": m["sigla_departamento"],
                    "statusAtual": m["status_atual"],
                    "totalDenuncias": str(m["total_denuncias_por_status"])
                }
                for m in metrics
            ]
        }
