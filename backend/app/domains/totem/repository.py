from typing import Any, Dict, List, Optional

import psycopg2
from psycopg2.extras import RealDictCursor


class TotemRepository:
    def __init__(self, connection):
        self.connection = connection

    def find_by_id(self, numero_serie: str) -> Optional[Dict[Any, Any]]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                "SELECT * FROM Totem WHERE Numero_Serie = %s", (numero_serie,)
            )
            return cursor.fetchone()

    def find_all(self) -> List[Dict[Any, Any]]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("SELECT * FROM Totem ORDER BY Numero_Serie")
            return cursor.fetchall()

    def create(
        self,
        numero_serie: str,
        nome_cidade: str,
        estado: str,
        coordenadas: str,
        status: str,
        data_instalacao: str,
    ) -> None:
        with self.connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO Totem (Numero_Serie, NomeCidade, Estado, Coordenadas, Status, Data_instalacao)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (
                    numero_serie,
                    nome_cidade,
                    estado,
                    coordenadas,
                    status,
                    data_instalacao,
                ),
            )
            self.connection.commit()

    def delete(self, numero_serie: str) -> None:
        with self.connection.cursor() as cursor:
            cursor.execute("DELETE FROM Totem WHERE Numero_Serie = %s", (numero_serie,))
            self.connection.commit()
