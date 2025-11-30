class RedeemRecompensaUseCase:
    def __init__(self, recompensa_repository, denunciante_repository):
        self.recompensa_repository = recompensa_repository
        self.denunciante_repository = denunciante_repository

    def execute(self, usuario_cpf: str, recompensa_nome: str):
        recompensa = self.recompensa_repository.find_by_name(recompensa_nome)
        if not recompensa:
            raise ValueError("Recompensa não encontrada")
        
        if recompensa['quantidade'] <= 0:
            raise ValueError("Recompensa esgotada")
        
        denunciante = self.denunciante_repository.find_by_usuario(usuario_cpf)
        if not denunciante:
            raise ValueError("Denunciante não encontrado")
        
        if denunciante['saldo_tokens'] < recompensa['valor_token']:
            raise ValueError("Saldo insuficiente")
        
        self.denunciante_repository.update_saldo(usuario_cpf, recompensa['valor_token'])
        self.recompensa_repository.update_quantidade(recompensa_nome)
        self.recompensa_repository.create_resgate(usuario_cpf, recompensa_nome)
        
        return {"message": "Recompensa resgatada com sucesso"}
