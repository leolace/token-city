import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Optional, Dict, Any

class TotemRepository:
    def __init__(self, connection):
        self.connection = connection

    def find_by_id(self, numero_serie: str) -> Optional[Dict[Any, Any]]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                "SELECT * FROM Totem WHERE Numero_Serie = %s",
                (numero_serie,)
            )
            return cursor.fetchone()
