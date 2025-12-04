from typing import Any, Dict, List

from psycopg2.extras import RealDictCursor


class RecompensaRepository:
    def __init__(self, connection):
        self.connection = connection

    def find_all(self) -> List[Dict[Any, Any]]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("SELECT * FROM Recompensa")
            return cursor.fetchall()

    def find_by_name(self, nome: str) -> Dict[Any, Any]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("SELECT * FROM Recompensa WHERE Nome = %s", (nome,))
            return cursor.fetchone()

    def update_quantidade(self, recompensa_nome: str) -> None:
        with self.connection.cursor() as cursor:
            cursor.execute(
                "UPDATE Recompensa SET Quantidade = Quantidade - 1 WHERE Nome = %s",
                (recompensa_nome,),
            )
            self.connection.commit()

    def create_resgate(self, usuario_cpf: str, recompensa_nome: str) -> None:
        with self.connection.cursor() as cursor:
            cursor.execute(
                """INSERT INTO Resgate (Data, Recompensa, Usuario, Status)
                VALUES (CURRENT_DATE, %s, %s, 'Pendente')
                ON CONFLICT (Usuario, Recompensa) DO NOTHING""",
                (recompensa_nome, usuario_cpf),
            )
            self.connection.commit()

    def count_resgates(self) -> int:
        with self.connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM Resgate")
            result = cursor.fetchone()
            return result[0] if result else 0

    def create(self, nome: str, quantidade: int, valor_token: float) -> None:
        with self.connection.cursor() as cursor:
            cursor.execute(
                """INSERT INTO Recompensa (Nome, Quantidade, Valor_token)
                VALUES (%s, %s, %s)""",
                (nome, quantidade, valor_token),
            )
            self.connection.commit()

    def find_resgates_by_usuario(self, usuario_cpf: str) -> List[Dict[Any, Any]]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT
                    R.Nome AS nome,
                    R.Quantidade AS quantidade,
                    R.Valor_token AS valor_token,
                    RE.Data AS data_resgate,
                    RE.Status AS status
                FROM
                    Resgate AS RE
                INNER JOIN
                    Recompensa AS R ON RE.Recompensa = R.Nome
                WHERE
                    RE.Usuario = %s
                ORDER BY RE.Data DESC
            """,
                (usuario_cpf,),
            )
            return cursor.fetchall()
