from fastapi import HTTPException


class UpdateStatusUseCase:
    def __init__(self, denuncia_repository, denunciante_repository=None):
        self.denuncia_repository = denuncia_repository
        self.denunciante_repository = denunciante_repository

    def execute(
        self,
        usuario: str,
        data: str,
        coordenadas: str,
        novo_status: str,
        matricula_funcionario: str,
    ):
        if not self.denuncia_repository.find_by_id(usuario, data, coordenadas):
            raise HTTPException(status_code=404, detail="Denúncia não encontrada")
        
        status_validos = [
            "Registrada",
            "Em Validação",
            "Em Andamento",
            "Resolvida",
            "Rejeitada"
        ]
        if novo_status not in status_validos:
            raise HTTPException(
                status_code=400,
                detail=f"Status inválido. Status válidos: {', '.join(status_validos)}"
            )
        
        status_atual = self.denuncia_repository.get_current_status(usuario, data, coordenadas)
        
        transicoes_validas = {
            "Registrada": ["Em Validação", "Rejeitada"],
            "Em Validação": ["Em Andamento", "Rejeitada"],
            "Em Andamento": ["Resolvida", "Rejeitada"],
            "Resolvida": [],
            "Rejeitada": []
        }
        
        if status_atual and novo_status not in transicoes_validas.get(status_atual, []):
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Transição inválida de '{status_atual}' para '{novo_status}'. "
                    f"Transições permitidas: {', '.join(transicoes_validas.get(status_atual, [])) or 'Nenhuma (status final)'}"
                )
            )
        
        self.denuncia_repository.update_status(
            usuario, data, coordenadas, novo_status, matricula_funcionario
        )
        
        if novo_status == "Em Validação" and self.denunciante_repository:
            self.denunciante_repository.add_tokens(usuario, 50)
        
        return {"message": "Status atualizado com sucesso"}
