-- Seed data para projeto_bd

-- Cidades
INSERT INTO Cidade (Nome, Estado) VALUES
('São Paulo', 'SP'),
('São Carlos', 'SP'),
('Rio de Janeiro', 'RJ'),
('Belo Horizonte', 'MG');

-- Categorias
INSERT INTO Categoria (Nome) VALUES
('Buraco'),
('Iluminação'),
('Lixo'),
('Calçada'),
('Sinalização');

-- Departamentos
INSERT INTO Departamento (Sigla, Nome, NomeCidade, Estado, Coordenadas) VALUES
('DEPT01', 'Obras e Infraestrutura', 'São Paulo', 'SP', '-23.550520,-46.633309'),
('DEPT02', 'Limpeza Urbana', 'São Paulo', 'SP', '-23.550520,-46.633309'),
('DEPT03', 'Iluminação Pública', 'Rio de Janeiro', 'RJ', '-22.906847,-43.172896');

-- Categoria_Departamento
INSERT INTO Categoria_Departamento (Categoria, Sigla) VALUES
('Buraco', 'DEPT01'),
('Iluminação', 'DEPT01'),
('Lixo', 'DEPT01'),
('Calçada', 'DEPT01'),
('Sinalização', 'DEPT01'),
('Lixo', 'DEPT02'),
('Iluminação', 'DEPT03');

-- Totems
    INSERT INTO Totem (Numero_Serie, NomeCidade, Estado, Coordenadas, Status, Data_instalacao) VALUES
    ('TOTEM001', 'São Paulo', 'SP', '-23.550520,-46.633309', 'Ativo', '2024-01-15'),
    ('TOTEM002', 'Rio de Janeiro', 'RJ', '-22.906847,-43.172896', 'Ativo', '2024-02-20'),
    ('TOTEM003', 'São Paulo', 'SP', '-23.561684,-46.656139', 'Ativo', '2024-03-10'),
    ('TOTEM004', 'São Carlos', 'SP', '-22.006775, -47.896859', 'Ativo', '2024-03-10');

-- Usuários
INSERT INTO Usuario (CPF, Nome, Senha, Email) VALUES
('12345678901', 'Ana Costa', 'senha123', 'ana@email.com'),
('98765432100', 'Pedro Lima', 'senha123', 'pedro@email.com'),
('11122233344', 'Carla Souza', 'senha123', 'carla@email.com'),
('11111111111', 'João Silva', 'senha123', 'joao@dept01.com'),
('22222222222', 'Maria Santos', 'senha123', 'maria@dept02.com');

-- Denunciantes
INSERT INTO Denunciante (Usuario, Saldo_Tokens, Status) VALUES
('12345678901', 150, 'ativo'),
('98765432100', 80, 'ativo'),
('11122233344', 200, 'ativo');

-- Funcionários
INSERT INTO Funcionario (Usuario, Matricula, Data_admissao, Cargo, Nivel, Sigla) VALUES
('11111111111', 'MAT0000001', '2023-01-10', 'Coordenador', 'ADMINISTRADOR', 'DEPT01'),
('22222222222', 'MAT0000002', '2023-02-15', 'Analista', 'OPERADOR', 'DEPT02');

-- Administrador
INSERT INTO Administrador (Usuario, Ultima_alteracao_sistema) VALUES
('11111111111', '2024-11-30');

-- Operador
INSERT INTO Operador (Usuario) VALUES
('22222222222');

-- Operador_Departamento
INSERT INTO Operador_Departamento (Sigla, Operador) VALUES
('DEPT02', '22222222222');

-- Recompensas
INSERT INTO Recompensa (Nome, Valor_token, Quantidade) VALUES
('Cupom10Reais', 50.00, 100),
('Cupom25Reais', 100.00, 50),
('Cupom50Reais', 200.00, 25);

-- Denúncias
INSERT INTO Denuncia (Categoria, Usuario, Totem, Data, Coordenadas, Descricao, Valida, Prioridade, Sigla) VALUES
('Buraco', '12345678901', 'TOTEM001', '2024-11-15', '-23.550520,-46.633309', 'Buraco grande na Av Paulista', TRUE, 3, 'DEPT01'),
('Lixo', '98765432100', 'TOTEM001', '2024-11-20', '-23.550520,-46.633309', 'Lixo acumulado', FALSE, 1, 'DEPT02'),
('Iluminação', '12345678901', 'TOTEM002', '2024-11-25', '-22.906847,-43.172896', 'Poste apagado', TRUE, 2, 'DEPT03'),
('Calçada', '11122233344', 'TOTEM003', '2024-11-28', '-23.561684,-46.656139', 'Calçada quebrada', FALSE, 1, 'DEPT01');

-- Histórico de Denúncias
INSERT INTO Historico_Denuncia (Usuario, Data, Coordenadas, Status) VALUES
('12345678901', '2024-11-15', '-23.550520,-46.633309', 'Em Andamento'),
('98765432100', '2024-11-20', '-23.550520,-46.633309', 'Registrada'),
('12345678901', '2024-11-25', '-22.906847,-43.172896', 'Em Validação'),
('11122233344', '2024-11-28', '-23.561684,-46.656139', 'Registrada');

-- FuncionarioDenuncia
INSERT INTO FuncionarioDenuncia (Matricula, Usuario_Denunciante, Data_Denuncia, Coordenadas, Atuacao) VALUES
('MAT0000001', '12345678901', '2024-11-15', '-23.550520,-46.633309', 'Análise'),
('MAT0000002', '98765432100', '2024-11-20', '-23.550520,-46.633309', 'Validação');

-- Resgates
INSERT INTO Resgate (Data, Recompensa, Usuario, Status) VALUES
('2024-11-10', 'Cupom10Reais', '12345678901', 'Concluído'),
('2024-11-22', 'Cupom25Reais', '11122233344', 'Pendente');
