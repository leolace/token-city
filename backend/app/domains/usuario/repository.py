from psycopg2.extras import RealDictCursor
from typing import Optional, Dict, Any

class UsuarioRepository:
    def __init__(self, connection):
        self.connection = connection

    def find_by_email_and_password(self, email: str, senha: str) -> Optional[Dict[Any, Any]]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                "SELECT CPF, Nome, Email FROM Usuario WHERE Email = %s AND Senha = %s",
                (email, senha)
            )
            return cursor.fetchone()

    def find_by_email(self, email: str) -> Optional[Dict[Any, Any]]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                "SELECT CPF, Nome, Email FROM Usuario WHERE Email = %s",
                (email,)
            )
            return cursor.fetchone()

    def find_by_matricula_and_password(self, matricula: str, senha: str) -> Optional[Dict[Any, Any]]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                SELECT 
                    u.CPF, 
                    u.Nome, 
                    u.Email, 
                    f.Matricula, 
                    f.Cargo, 
                    f.Nivel,
                    COALESCE(
                        (SELECT json_agg(od.Sigla) 
                         FROM Operador_Departamento od 
                         WHERE od.Operador = f.Usuario),
                        '[]'::json
                    ) as Departamentos
                FROM Usuario u
                INNER JOIN Funcionario f ON u.CPF = f.Usuario
                INNER JOIN Operador o ON o.Usuario = f.Usuario
                WHERE f.Matricula = %s AND u.Senha = %s AND f.Nivel = 'OPERADOR'
            """, (matricula, senha))
            return cursor.fetchone()

    def find_admin_by_matricula_and_password(self, matricula: str, senha: str) -> Optional[Dict[Any, Any]]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                SELECT 
                    u.CPF, 
                    u.Nome, 
                    u.Email, 
                    f.Matricula, 
                    f.Cargo, 
                    f.Nivel
                FROM Usuario u
                INNER JOIN Funcionario f ON u.CPF = f.Usuario
                INNER JOIN Administrador a ON a.Usuario = f.Usuario
                WHERE f.Matricula = %s AND u.Senha = %s AND f.Nivel = 'ADMINISTRADOR'
            """, (matricula, senha))
            return cursor.fetchone()

    def create(self, cpf: str, nome: str, senha: str, email: str) -> Dict[Any, Any]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                "INSERT INTO Usuario (CPF, Nome, Senha, Email) VALUES (%s, %s, %s, %s) RETURNING *",
                (cpf, nome, senha, email)
            )
            self.connection.commit()
            return cursor.fetchone()
