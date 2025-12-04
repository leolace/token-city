class DeleteTotemUseCase:
    def __init__(self, totem_repository):
        self.totem_repository = totem_repository

    def execute(self, numero_serie: str):
        # Verifica se o totem existe antes de deletar
        totem = self.totem_repository.find_by_id(numero_serie)
        if not totem:
            return False

        self.totem_repository.delete(numero_serie)
        return True
