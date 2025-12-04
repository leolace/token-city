from psycopg2.extras import RealDictCursor
from typing import List, Dict, Any

class DepartamentoRepository:
    def __init__(self, connection):
        self.connection = connection

    def find_all_category_handlers(self) -> List[Dict[Any, Any]]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                SELECT
                    D.Sigla,
                    D.Nome
                FROM
                    Departamento AS D
                INNER JOIN
                    Categoria_Departamento AS CD ON D.Sigla = CD.Sigla
                GROUP BY
                    D.Sigla,
                    D.Nome
                HAVING
                    COUNT(CD.Categoria) = (SELECT COUNT(*) FROM Categoria)
            """)
            return cursor.fetchall()

    def find_categories_by_totem(self, numero_serie: str) -> List[Dict[Any, Any]]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                SELECT DISTINCT CD.Categoria AS nome
                FROM Categoria_Departamento CD
                INNER JOIN Departamento D ON CD.Sigla = D.Sigla
                INNER JOIN Totem T ON D.NomeCidade = T.NomeCidade AND D.Estado = T.Estado
                WHERE T.Numero_Serie = %s
                ORDER BY CD.Categoria
            """, (numero_serie,))
            return cursor.fetchall()
