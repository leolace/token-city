from app.domains.departamento.use_cases.get_all_category_handlers import (
    GetAllCategoryHandlersUseCase,
)


class DenuncianteController:
    def __init__(self, denunciante_repository):
        self.denunciante_repository = denunciante_repository

    def get_denunciante_profile(self, cpf: str):
        return self.denunciante_repository.get_profile_by_cpf(cpf)

    def get_top_denunciante(self):
        return self.denunciante_repository.find_top_denunciante()
