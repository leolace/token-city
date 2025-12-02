class GetAllTotemsUseCase:
    def __init__(self, totem_repository):
        self.totem_repository = totem_repository

    def execute(self):
        return self.totem_repository.find_all()