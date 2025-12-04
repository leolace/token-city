class CreateTotemUseCase:
    def __init__(self, totem_repository):
        self.totem_repository = totem_repository

    def execute(
        self,
        numero_serie: str,
        nome_cidade: str,
        estado: str,
        coordenadas: str,
        status: str,
        data_instalacao: str,
    ):
        self.totem_repository.create(
            numero_serie,
            nome_cidade,
            estado,
            coordenadas,
            status,
            data_instalacao,
        )
        return None
