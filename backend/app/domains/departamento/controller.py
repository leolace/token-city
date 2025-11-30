from app.domains.departamento.use_cases.get_all_category_handlers import GetAllCategoryHandlersUseCase

class DepartamentoController:
    def __init__(self, departamento_repository):
        self.get_all_category_handlers_use_case = GetAllCategoryHandlersUseCase(departamento_repository)

    def get_all_category_handlers(self):
        return self.get_all_category_handlers_use_case.execute()
