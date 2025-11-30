from psycopg2.extras import RealDictCursor
from typing import List, Dict, Any

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
                (recompensa_nome,)
            )
            self.connection.commit()

    def create_resgate(self, usuario_cpf: str, recompensa_nome: str) -> None:
        with self.connection.cursor() as cursor:
            cursor.execute(
                """INSERT INTO Resgate (Data, Recompensa, Usuario, Status)
                VALUES (CURRENT_DATE, %s, %s, 'Pendente')
                ON CONFLICT (Usuario, Recompensa) DO NOTHING""",
                (recompensa_nome, usuario_cpf)
            )
            self.connection.commit()
