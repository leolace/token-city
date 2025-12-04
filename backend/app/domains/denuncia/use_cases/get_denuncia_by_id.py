class GetDenunciaByIdUseCase:
    def __init__(self, denuncia_repository):
        self.denuncia_repository = denuncia_repository

    def execute(self, usuario: str, data: str, coordenadas: str):
        denuncia = self.denuncia_repository.find_by_id(usuario, data, coordenadas)
        return denuncia
