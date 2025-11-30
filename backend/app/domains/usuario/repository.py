from psycopg2.extras import RealDictCursor
from typing import Optional, Dict, Any

class UsuarioRepository:
    def __init__(self, connection):
        self.connection = connection

    def find_by_email_and_password(self, email: str, senha: str) -> Optional[Dict[Any, Any]]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                "SELECT * FROM Usuario WHERE Email = %s AND Senha = %s",
                (email, senha)
            )
            return cursor.fetchone()

    def find_by_email(self, email: str) -> Optional[Dict[Any, Any]]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                "SELECT * FROM Usuario WHERE Email = %s",
                (email,)
            )
            return cursor.fetchone()

    def create(self, cpf: str, nome: str, senha: str, email: str) -> Dict[Any, Any]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                "INSERT INTO Usuario (CPF, Nome, Senha, Email) VALUES (%s, %s, %s, %s) RETURNING *",
                (cpf, nome, senha, email)
            )
            self.connection.commit()
            return cursor.fetchone()
