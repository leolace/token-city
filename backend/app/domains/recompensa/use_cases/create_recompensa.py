class CreateRecompensaUseCase:
    def __init__(self, recompensa_repository):
        self.recompensa_repository = recompensa_repository

    def execute(self, nome: str, quantidade: int, valor_token: float):
        # Verificar se a recompensa já existe
        existing = self.recompensa_repository.find_by_name(nome)
        if existing:
            raise ValueError(f"Recompensa '{nome}' já existe")

        # Validações
        if quantidade < 0:
            raise ValueError("Quantidade não pode ser negativa")

        if valor_token <= 0:
            raise ValueError("Valor do token deve ser maior que zero")

        # Criar a recompensa
        self.recompensa_repository.create(nome, quantidade, valor_token)
        return None
