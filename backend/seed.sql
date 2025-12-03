-- Seed data para projeto_bd
-- Para respeitar a integridade referencial ou seja as Foreign Keys o script segue uma determinada ordem
-- Onde primeiro é inserido a tabela de Cidade, em seguida Categoria,
-- Departamento, Categoria_Departamento, Totem, Usuário, Denunciante,
-- Funcionario, Administrador, Operador, Operador_Departamento, Recompensa,
-- Denuncia, Historico_Denuncia, FuncionarioDenuncia e Resgate

-- Inserção das cidades.
-- Estas inserções são uma amostra reduzida para ajudar no desenvolvimento.
INSERT INTO Cidade (Nome, Estado) VALUES
('São Paulo', 'SP'),
('São Carlos', 'SP'),
('Rio de Janeiro', 'RJ'),
('Belo Horizonte', 'MG');

-- Inserção das categorias base de ocorrências.
-- Novos tipos de categoria podem ser cadastrados futuramente conforme a demanda.
INSERT INTO Categoria (Nome) VALUES
('Buraco'),
('Iluminação'),
('Lixo'),
('Calçada'),
('Sinalização');

-- Cadastro dos departamentos responsáveis pela gestão e resolução das ocorrências.
-- Inclui unidades com diferentes especialidades (Obras e Infraestrutura, Limpeza Urbana, Iluminação Pública)
-- distribuídas entre os estados de SP e RJ.
INSERT INTO Departamento (Sigla, Nome, NomeCidade, Estado, Coordenadas) VALUES
('DEPT01', 'Obras e Infraestrutura', 'São Paulo', 'SP', '-23.550520,-46.633309'),
('DEPT02', 'Limpeza Urbana', 'São Paulo', 'SP', '-23.550520,-46.633309'),
('DEPT03', 'Iluminação Pública', 'Rio de Janeiro', 'RJ', '-22.906847,-43.172896');

-- Vinculação inicial entre problemas (Categorias) e solucionadores (Departamentos).
-- Novos vínculos podem ser adicionados posteriormente, permitindo que a quantidade 
-- de tipos de problemas que um departamento pode atender cresça conforme a demanda.
INSERT INTO Categoria_Departamento (Categoria, Sigla) VALUES
('Buraco', 'DEPT01'),
('Iluminação', 'DEPT01'),
('Lixo', 'DEPT01'),
('Calçada', 'DEPT01'),
('Sinalização', 'DEPT01'),
('Lixo', 'DEPT02'),
('Iluminação', 'DEPT03');

-- Inserção dos terminais de atendimento (Totems) em diferentes localidades.
-- A amostra inclui unidades em capitais (SP, RJ) e no interior (São Carlos)
-- para validar o comportamento do sistema em diferentes coordenadas.
INSERT INTO Totem (Numero_Serie, NomeCidade, Estado, Coordenadas, Status, Data_instalacao) VALUES
('TOTEM001', 'São Paulo', 'SP', '-23.550520,-46.633309', 'Ativo', '2024-01-15'),
('TOTEM002', 'Rio de Janeiro', 'RJ', '-22.906847,-43.172896', 'Ativo', '2024-02-20'),
('TOTEM003', 'São Paulo', 'SP', '-23.561684,-46.656139', 'Ativo', '2024-03-10'),
('TOTEM004', 'São Carlos', 'SP', '-22.006775, -47.896859', 'Ativo', '2024-03-10');

-- Criação de contas de acesso iniciais para validação do fluxo de autenticação.
-- Inclui perfis mistos (futuros cidadãos e funcionários) com senhas padronizadas.
-- para facilitar os testes de desenvolvimento.
INSERT INTO Usuario (CPF, Nome, Senha, Email) VALUES
('12345678901', 'Ana Costa', 'senha123', 'ana@email.com'),
('98765432100', 'Pedro Lima', 'senha123', 'pedro@email.com'),
('11122233344', 'Carla Souza', 'senha123', 'carla@email.com'),
('11111111111', 'João Silva', 'senha123', 'joao@dept01.com'),
('22222222222', 'Maria Santos', 'senha123', 'maria@dept02.com');

-- Atribuição do papel de "Denunciante" aos usuários base previamente cadastrados.
-- Define o status operacional e o saldo inicial, habilitando o usuário a interagir
-- com o sistema de recompensas.
INSERT INTO Denunciante (Usuario, Saldo_Tokens, Status) VALUES
('12345678901', 150, 'ativo'),
('98765432100', 80, 'ativo'),
('11122233344', 200, 'ativo');

-- Cadastro de perfis funcionais com matrícula e data de admissão.
-- Estabelece o vínculo empregatício e o nível de acesso ao sistema administrativo.
INSERT INTO Funcionario (Usuario, Matricula, Data_admissao, Cargo, Nivel, Sigla) VALUES
('11111111111', 'MAT0000001', '2023-01-10', 'Coordenador', 'ADMINISTRADOR', 'DEPT01'),
('22222222222', 'MAT0000002', '2023-02-15', 'Analista', 'OPERADOR', 'DEPT02');

-- Atribui o perfil de Administrador a um usuário existente para permitir a gestão completa do sistema a ele.
INSERT INTO Administrador (Usuario, Ultima_alteracao_sistema) VALUES
('11111111111', '2024-11-30');

-- Atribui o perfil de Operador a um usuário existente para habilitar a execução de tarefas técnicas e operacionais a ele.
INSERT INTO Operador (Usuario) VALUES
('22222222222');

-- Vincula um operador a um departamento específico
INSERT INTO Operador_Departamento (Sigla, Operador) VALUES
('DEPT02', '22222222222');

-- Definição inicial da "economia" do sistema, estabelecendo custos em tokens e limites de estoque.
-- Novas recompensas podem ser inseridas futuramente para repor o inventário 
INSERT INTO Recompensa (Nome, Valor_token, Quantidade) VALUES
('Cupom10Reais', 50.00, 100),
('Cupom25Reais', 100.00, 50),
('Cupom50Reais', 200.00, 25);

-- Inserção de ocorrências simuladas com variações de status, categoria e localidade.
-- Serve de base para relatórios iniciais, inserindo registros posteriormente 
-- conforme o uso dos Totems pela população.
INSERT INTO Denuncia (Categoria, Usuario, Totem, Data, Coordenadas, Descricao, Valida, Prioridade, Sigla) VALUES
('Buraco', '12345678901', 'TOTEM001', '2024-11-15', '-23.550520,-46.633309', 'Buraco grande na Av Paulista', TRUE, 3, 'DEPT01'),
('Lixo', '98765432100', 'TOTEM001', '2024-11-20', '-23.550520,-46.633309', 'Lixo acumulado', FALSE, 1, 'DEPT02'),
('Iluminação', '12345678901', 'TOTEM002', '2024-11-25', '-22.906847,-43.172896', 'Poste apagado', TRUE, 2, 'DEPT03'),
('Calçada', '11122233344', 'TOTEM003', '2024-11-28', '-23.561684,-46.656139', 'Calçada quebrada', FALSE, 1, 'DEPT01');

-- Inicializa o histórico das denúncias para garantir a rastreabilidade do seu status.
-- Novos registros de status serão inseridos posteriormente à medida que as denúncias 
-- evoluírem dentro do fluxo de atendimento (ex: análise, resolução).
INSERT INTO Historico_Denuncia (Usuario, Data_Emissao_Denuncia, Coordenadas, Data_Historico, Status) VALUES
-- Histórico da Denúncia 1 (Buraco - 2024-11-15 - Válida)
('12345678901', '2024-11-15', '-23.550520,-46.633309', '2024-11-15', 'Registrada'),
('12345678901', '2024-11-15', '-23.550520,-46.633309', '2024-11-16', 'Em Análise'),
('12345678901', '2024-11-15', '-23.550520,-46.633309', '2024-11-18', 'Em Andamento'),

-- Histórico da Denúncia 2 (Lixo - 2024-11-20 - Inválida)
('98765432100', '2024-11-20', '-23.550520,-46.633309', '2024-11-20', 'Registrada'),
('98765432100', '2024-11-20', '-23.550520,-46.633309', '2024-11-21', 'Em Validação'),
('98765432100', '2024-11-20', '-23.550520,-46.633309', '2024-11-22', 'Recusada'),

-- Histórico da Denúncia 3 (Iluminação - 2024-11-25 - Válida)
('12345678901', '2024-11-25', '-22.906847,-43.172896', '2024-11-25', 'Registrada'),
('12345678901', '2024-11-25', '-22.906847,-43.172896', '2024-11-26', 'Em Manutenção'),
('12345678901', '2024-11-25', '-22.906847,-43.172896', '2024-11-27', 'Concluída'),

-- Histórico da Denúncia 4 (Calçada - 2024-11-28 - Inválida)
('11122233344', '2024-11-28', '-23.561684,-46.656139', '2024-11-28', 'Registrada'),
('11122233344', '2024-11-28', '-23.561684,-46.656139', '2024-11-29', 'Em Validação'),
('11122233344', '2024-11-28', '-23.561684,-46.656139', '2024-11-30', 'Arquivada');

-- Cria registros de atendimento para validar o relacionamento entre Funcionário e Denúncia,
-- simulando um cenário de teste onde a equipe técnica já está atuando (Análise/Validação)
-- nas ocorrências recebidas.
INSERT INTO FuncionarioDenuncia (Matricula, Usuario_Denunciante, Data_Denuncia, Coordenadas, Atuacao) VALUES
('MAT0000001', '12345678901', '2024-11-15', '-23.550520,-46.633309', 'Análise'),
('MAT0000002', '98765432100', '2024-11-20', '-23.550520,-46.633309', 'Validação');

-- Insere transações de troca de tokens com status variados ('Concluído' e 'Pendente')
INSERT INTO Resgate (Data, Recompensa, Usuario, Status) VALUES
('2024-11-10', 'Cupom10Reais', '12345678901', 'Concluído'),
('2024-11-22', 'Cupom25Reais', '11122233344', 'Pendente');
