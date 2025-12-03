-- Permite com que seja usadas funções da extensão postgis, das quais são usadas para realizar cálculos geográficos essenciais para o sistema
CREATE EXTENSION IF NOT EXISTS postgis;

-- Criamos um tipo para coordenadas para ser mais fácil a reusabilidade e manutenção caso futuramente seja necessário criar mais tabelas com atributos de coordenadas
-- Incluímos uma CONSTRAINT que valida automaticamente qualquer coluna que use o tipo descrito acima.
-- A Regex garante: Latitude (-90 a 90) e Longitude (-180 a 180), separadas por vírgula.
CREATE DOMAIN TipoCoordenadas AS VARCHAR(120)
CONSTRAINT chk_coordenadas CHECK (
    VALUE ~ '^[-+]?([1-8]?[0-9](\.[0-9]+)?|90(\.0+)?),\s*[-+]?((1[0-7][0-9]|[0-9]{1,2})(\.[0-9]+)?|180(\.0+)?)$'
);

-- Criação da tabela base Usuario
CREATE TABLE Usuario (
    CPF CHAR(11) NOT NULL PRIMARY KEY,
    Nome VARCHAR(120) NOT NULL,
    Senha VARCHAR(200) NOT NULL,
    Email VARCHAR(150) NOT NULL
);

-- Criação da tabela dos usuários que realizam as denúncias (Denunciante)
CREATE TABLE Denunciante (
    Usuario CHAR(11) NOT NULL PRIMARY KEY,
    Saldo_Tokens INT NOT NULL,
    Status VARCHAR(30) NOT NULL CHECK (Status IN ('ativo', 'suspenso', 'excluido')) DEFAULT 'ativo',
    FOREIGN KEY (Usuario) REFERENCES Usuario(CPF) ON DELETE CASCADE,

    CONSTRAINT CK_SaldoNegativo CHECK(Saldo_Tokens >= 0)
);

-- Criação da tabela Cidade
CREATE TABLE Cidade (
    Nome VARCHAR(120) NOT NULL,
    Estado CHAR(2) NOT NULL,
    PRIMARY KEY (Nome, Estado)
);

-- Criação da tabela dos departamentos
CREATE TABLE Departamento (
    Sigla VARCHAR(10) NOT NULL PRIMARY KEY,
    NomeCidade VARCHAR(120) NOT NULL,
    Estado CHAR(2) NOT NULL,
    Nome VARCHAR(200) NOT NULL,
    Coordenadas TipoCoordenadas NOT NULL,
    FOREIGN KEY (NomeCidade, Estado) REFERENCES Cidade(Nome, Estado) ON DELETE CASCADE
);

-- Criação da tabela Categoria, essa tabela é própria do sistema utilizada para armazenar todos os tipos de categorias de denúncias que podem ser
-- cadastrados
CREATE TABLE Categoria (
    Nome VARCHAR(100) NOT NULL PRIMARY KEY
);

-- Criação da tabela Categoria_Departamento, essa tabela é utilizada para armazenar as denúncias que determinado departamento atende,
-- o departamento não necessariamente deve atender a todas as categorias do sistema
CREATE TABLE Categoria_Departamento (
    Sigla VARCHAR(10) NOT NULL,
    Categoria VARCHAR(100) NOT NULL,
    PRIMARY KEY (Sigla, Categoria),

    FOREIGN KEY (Sigla) REFERENCES Departamento(Sigla) ON DELETE CASCADE,
    FOREIGN KEY (Categoria) REFERENCES Categoria(Nome) ON DELETE CASCADE,

    CONSTRAINT CK_categoria_atendida CHECK (Categoria IS NOT NULL)
);

-- Criação da tabela funcionario 
CREATE TABLE Funcionario (
    Usuario CHAR(11) NOT NULL PRIMARY KEY,
    Matricula CHAR(11) NOT NULL,
    Data_admissao DATE NOT NULL,
    Cargo VARCHAR(100) NOT NULL,
    Nivel VARCHAR(15) NOT NULL CHECK(Nivel in('ADMINISTRADOR', 'OPERADOR')),
    Sigla VARCHAR(10) NOT NULL,

    UNIQUE (Matricula),

    FOREIGN KEY (Usuario) REFERENCES Usuario(CPF) ON DELETE CASCADE,
    FOREIGN KEY (Sigla) REFERENCES Departamento(Sigla) ON DELETE CASCADE
);

-- Criação da tabela Operador
CREATE TABLE Operador (
    Usuario CHAR(11) NOT NULL PRIMARY KEY,
    FOREIGN KEY (Usuario) REFERENCES Funcionario(Usuario) ON DELETE CASCADE
);

-- Criação da tabela associativa que liga um operador a um departamento (N:N).
CREATE TABLE Operador_Departamento (
    Sigla VARCHAR(10) NOT NULL,
    Operador CHAR(11) NOT NULL,

    PRIMARY KEY (Sigla, Operador),

    FOREIGN KEY (Sigla) REFERENCES Departamento(Sigla) ON DELETE CASCADE,
    FOREIGN KEY (Operador) REFERENCES Operador(Usuario) ON DELETE CASCADE
);

-- Criação da tabela Administrador.
CREATE TABLE Administrador (
    Usuario CHAR(11) NOT NULL PRIMARY KEY,
    Ultima_alteracao_sistema DATE NOT NULL,

    FOREIGN KEY (Usuario) REFERENCES Funcionario(Usuario) ON DELETE CASCADE
);

-- Criação da tabela Totem.
CREATE TABLE Totem (
    Numero_Serie VARCHAR(60) NOT NULL PRIMARY KEY,
    NomeCidade VARCHAR(120) NOT NULL,
    Estado CHAR(2) NOT NULL,
    Coordenadas TipoCoordenadas NOT NULL,
    Status VARCHAR(50) NOT NULL,
    Data_instalacao DATE NOT NULL,

    FOREIGN KEY (NomeCidade, Estado) REFERENCES Cidade(Nome, Estado) ON DELETE CASCADE
);

-- Criação da tabela Recompensa.
CREATE TABLE Recompensa (
    Nome VARCHAR(100) NOT NULL PRIMARY KEY,
    Quantidade INT NOT NULL CHECK (Quantidade >= 0),
    Valor_token DECIMAL(10,2) NOT NULL CHECK (Valor_token > 0)
);

-- Criação da tabela associativa que liga um usuário a uma recompensa.
CREATE TABLE Resgate (
    Data DATE NOT NULL,
    Recompensa VARCHAR(100) NOT NULL,
    Usuario CHAR(11) NOT NULL,
    Status VARCHAR(50) NOT NULL,

    PRIMARY KEY (Usuario, Recompensa),

    FOREIGN KEY (Recompensa) REFERENCES Recompensa(Nome) ON DELETE CASCADE,
    FOREIGN KEY (Usuario) REFERENCES Usuario(CPF) ON DELETE CASCADE
);

-- Criação da tabela Denuncia.
CREATE TABLE Denuncia (
    Categoria VARCHAR(100) NOT NULL,
    Usuario CHAR(11) NOT NULL,
    Totem VARCHAR(60) NOT NULL,
    Data DATE NOT NULL,
    Coordenadas TipoCoordenadas NOT NULL,
    Descricao TEXT NOT NULL,
    Valida BOOLEAN NOT NULL,
    Prioridade INT NOT NULL,
    Sigla VARCHAR(10) NOT NULL,

    PRIMARY KEY (Usuario, Data, Coordenadas),

    FOREIGN KEY (Categoria) REFERENCES Categoria(Nome) ON DELETE CASCADE,
    FOREIGN KEY (Usuario) REFERENCES Usuario(CPF) ON DELETE CASCADE,
    FOREIGN KEY (Totem) REFERENCES Totem(Numero_Serie) ON DELETE CASCADE,
    FOREIGN KEY (Sigla) REFERENCES Departamento(Sigla) ON DELETE CASCADE
);

-- Criação da tabela Historico_Denuncia, aqui colocamos um ON DELETE CASCADE pois se uma denúncia for apagada do sistema seu histórico
-- também deve ser apagado.
CREATE TABLE Historico_Denuncia (
    Usuario CHAR(11) NOT NULL,
    Coordenadas TipoCoordenadas NOT NULL,
    Data_Emissao_Denuncia DATE NOT NULL,
    Data_Historico DATE NOT NULL DEFAULT(now()),
    Status VARCHAR(50) NOT NULL,

    PRIMARY KEY (Usuario, Data_Emissao_Denuncia, Coordenadas, Data_Historico),

    FOREIGN KEY (Usuario, Data_Emissao_Denuncia, Coordenadas)
        REFERENCES Denuncia(Usuario, Data, Coordenadas)
        ON DELETE CASCADE
);

-- Criação da tabela Midia que armazena a mídia de cada denúncia, colocamos o ON DELETE CASCADE para que quando uma denúncia for excluída
-- do sistema suas mídias também sejam excluídas.
CREATE TABLE Midia (
    URL VARCHAR(300) NOT NULL,
    Usuario CHAR(11) NOT NULL,
    Data DATE NOT NULL,
    Coordenadas TipoCoordenadas NOT NULL,
    Tipo VARCHAR(50) NOT NULL,

    PRIMARY KEY (URL, Usuario, Data, Coordenadas),

    FOREIGN KEY (Usuario, Data, Coordenadas)
        REFERENCES Denuncia(Usuario, Data, Coordenadas)
        ON DELETE CASCADE
);

-- Tabela associativa (N:N) que relaciona os funcionários com as denúncias que eles atuam.
CREATE TABLE FuncionarioDenuncia (
    Matricula CHAR(11) NOT NULL,
    Usuario_Denunciante CHAR(11) NOT NULL,
    Data_Denuncia DATE NOT NULL,
    Coordenadas TipoCoordenadas NOT NULL,
    Atuacao VARCHAR(30) NOT NULL,

    PRIMARY KEY (Matricula, Usuario_Denunciante, Data_Denuncia, Coordenadas),

    FOREIGN KEY (Matricula) REFERENCES Funcionario(Matricula) ON DELETE CASCADE,

    FOREIGN KEY (Usuario_Denunciante, Data_Denuncia, Coordenadas)
        REFERENCES Denuncia(Usuario, Data, Coordenadas)
        ON DELETE CASCADE
);
