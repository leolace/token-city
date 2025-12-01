CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE Usuario (
    CPF CHAR(11) NOT NULL PRIMARY KEY,
    Nome VARCHAR(120) NOT NULL,
    Senha VARCHAR(200) NOT NULL,
    Email VARCHAR(150) NOT NULL
);

CREATE TABLE Denunciante (
    Usuario CHAR(11) NOT NULL PRIMARY KEY,
    Saldo_Tokens INT NOT NULL,
    Status VARCHAR(30) NOT NULL CHECK (Status IN ('ativo', 'suspenso', 'excluido')) DEFAULT 'ativo',
    FOREIGN KEY (Usuario) REFERENCES Usuario(CPF) ON DELETE CASCADE,

    CONSTRAINT CK_SaldoNegativo CHECK(Saldo_Tokens >= 0)
);

CREATE TABLE Cidade (
    Nome VARCHAR(120) NOT NULL,
    Estado CHAR(2) NOT NULL,
    PRIMARY KEY (Nome, Estado)
);

CREATE TABLE Departamento (
    Sigla VARCHAR(10) NOT NULL PRIMARY KEY,
    NomeCidade VARCHAR(120) NOT NULL,
    Estado CHAR(2) NOT NULL,
    Nome VARCHAR(200) NOT NULL,
    Coordenadas VARCHAR(120) NOT NULL,
    FOREIGN KEY (NomeCidade, Estado) REFERENCES Cidade(Nome, Estado) ON DELETE CASCADE
);

CREATE TABLE Categoria (
    Nome VARCHAR(100) NOT NULL PRIMARY KEY
);

CREATE TABLE Categoria_Departamento (
    Sigla VARCHAR(10) NOT NULL,
    Categoria VARCHAR(100) NOT NULL,
    PRIMARY KEY (Sigla, Categoria),

    FOREIGN KEY (Sigla) REFERENCES Departamento(Sigla) ON DELETE CASCADE,
    FOREIGN KEY (Categoria) REFERENCES Categoria(Nome) ON DELETE CASCADE,

    CONSTRAINT CK_categoria_atendida CHECK (Categoria IS NOT NULL)
);

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

CREATE TABLE Operador (
    Usuario CHAR(11) NOT NULL PRIMARY KEY,
    FOREIGN KEY (Usuario) REFERENCES Funcionario(Usuario) ON DELETE CASCADE
);

CREATE TABLE Operador_Departamento (
    Sigla VARCHAR(10) NOT NULL,
    Operador CHAR(11) NOT NULL,

    PRIMARY KEY (Sigla, Operador),

    FOREIGN KEY (Sigla) REFERENCES Departamento(Sigla) ON DELETE CASCADE,
    FOREIGN KEY (Operador) REFERENCES Operador(Usuario) ON DELETE CASCADE
);

CREATE TABLE Administrador (
    Usuario CHAR(11) NOT NULL PRIMARY KEY,
    Ultima_alteracao_sistema DATE NOT NULL,

    FOREIGN KEY (Usuario) REFERENCES Funcionario(Usuario) ON DELETE CASCADE
);

CREATE TABLE Totem (
    Numero_Serie VARCHAR(60) NOT NULL PRIMARY KEY,
    NomeCidade VARCHAR(120) NOT NULL,
    Estado CHAR(2) NOT NULL,
    Coordenadas VARCHAR(120) NOT NULL,
    Status VARCHAR(50) NOT NULL,
    Data_instalacao DATE NOT NULL,

    FOREIGN KEY (NomeCidade, Estado) REFERENCES Cidade(Nome, Estado) ON DELETE CASCADE
);

CREATE TABLE Recompensa (
    Nome VARCHAR(100) NOT NULL PRIMARY KEY,
    Quantidade INT NOT NULL CHECK (Quantidade >= 0),
    Valor_token DECIMAL(10,2) NOT NULL CHECK (Valor_token > 0)
);

CREATE TABLE Resgate (
    Data DATE NOT NULL,
    Recompensa VARCHAR(100) NOT NULL,
    Usuario CHAR(11) NOT NULL,
    Status VARCHAR(50) NOT NULL,

    PRIMARY KEY (Usuario, Recompensa),

    FOREIGN KEY (Recompensa) REFERENCES Recompensa(Nome) ON DELETE CASCADE,
    FOREIGN KEY (Usuario) REFERENCES Usuario(CPF) ON DELETE CASCADE
);

CREATE TABLE Denuncia (
    Categoria VARCHAR(100) NOT NULL,
    Usuario CHAR(11) NOT NULL,
    Totem VARCHAR(60) NOT NULL,
    Data DATE NOT NULL,
    Coordenadas VARCHAR(120) NOT NULL,
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

CREATE TABLE Historico_Denuncia (
    Usuario CHAR(11) NOT NULL,
    Data DATE NOT NULL,
    Coordenadas VARCHAR(120) NOT NULL,
    Status VARCHAR(50) NOT NULL,

    PRIMARY KEY (Usuario, Data, Coordenadas),

    FOREIGN KEY (Usuario, Data, Coordenadas)
        REFERENCES Denuncia(Usuario, Data, Coordenadas)
        ON DELETE CASCADE
);

CREATE TABLE Midia (
    URL VARCHAR(300) NOT NULL,
    Usuario CHAR(11) NOT NULL,
    Data DATE NOT NULL,
    Coordenadas VARCHAR(120) NOT NULL,
    Tipo VARCHAR(50) NOT NULL,

    PRIMARY KEY (URL, Usuario, Data, Coordenadas),

    FOREIGN KEY (Usuario, Data, Coordenadas)
        REFERENCES Denuncia(Usuario, Data, Coordenadas)
        ON DELETE CASCADE
);

CREATE TABLE FuncionarioDenuncia (
    Matricula CHAR(11) NOT NULL,
    Usuario_Denunciante CHAR(11) NOT NULL,
    Data_Denuncia DATE NOT NULL,
    Coordenadas VARCHAR(120) NOT NULL,
    Atuacao VARCHAR(30) NOT NULL,

    PRIMARY KEY (Matricula, Usuario_Denunciante, Data_Denuncia, Coordenadas),

    FOREIGN KEY (Matricula) REFERENCES Funcionario(Matricula) ON DELETE CASCADE,

    FOREIGN KEY (Usuario_Denunciante, Data_Denuncia, Coordenadas)
        REFERENCES Denuncia(Usuario, Data, Coordenadas)
        ON DELETE CASCADE
);
