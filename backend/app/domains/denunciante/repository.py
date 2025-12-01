from psycopg2.extras import RealDictCursor
from typing import Dict, Any

class DenuncianteRepository:
    def __init__(self, connection):
        self.connection = connection

    def find_by_usuario(self, usuario_cpf: str) -> Dict[Any, Any]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("SELECT * FROM Denunciante WHERE Usuario = %s", (usuario_cpf,))
            return cursor.fetchone()
        
    def get_profile_by_cpf(self, usuario_cpf: str):
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
            SELECT
                Usuario.cpf,
                Usuario.nome,
                Usuario.email,
                Denunciante.saldo_tokens,
                Denunciante.status,
                Denunciante.usuario
            FROM Usuario
            JOIN Denunciante ON Usuario.cpf = Denunciante.usuario
            WHERE Usuario.cpf = %s
        """, (usuario_cpf,))
            return cursor.fetchone()
        
    def create(self, usuario_cpf: str) -> None:
        with self.connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO Denunciante (Usuario, Saldo_Tokens, Status) VALUES (%s, 0, 'ativo')",
                (usuario_cpf,)
            )
            self.connection.commit()

    def update_saldo(self, usuario_cpf: str, valor: int) -> None:
        with self.connection.cursor() as cursor:
            cursor.execute(
                "UPDATE Denunciante SET Saldo_Tokens = Saldo_Tokens - %s WHERE Usuario = %s",
                (valor, usuario_cpf)
            )
            self.connection.commit()

    def find_top_denunciante(self) -> Dict[Any, Any]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                SELECT
                    U.Nome,
                    U.CPF,
                    D.Saldo_Tokens
                FROM
                    Denunciante AS D
                JOIN
                    Usuario AS U ON D.Usuario = U.CPF
                WHERE
                    D.Usuario IN (
                        SELECT
                            Usuario
                        FROM
                            Denuncia
                        GROUP BY
                            Usuario
                        HAVING
                            COUNT(*) > 1
                    )
                ORDER BY
                    D.Saldo_Tokens DESC,
                    U.Nome DESC
                LIMIT 1
            """)
            return cursor.fetchone()
