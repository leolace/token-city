class CreateDenunciaUseCase:
    def __init__(self, denuncia_repository):
        self.denuncia_repository = denuncia_repository

    def execute(
        self,
        userid: str,
        category: str,
        content: str,
        totem: str,
        coordenadas: str,
        image: str = None,
    ):
        self.denuncia_repository.create(
            userid, category, content, totem, coordenadas, image
        )
        return None
