from typing import Any, Dict, List

from fastapi import HTTPException
from psycopg2.extras import RealDictCursor


class DenunciaRepository:
    def __init__(self, connection):
        self.connection = connection

    def create(
        self,
        userid: str,
        category: str,
        content: str,
        totem: str,
        coordenadas: str,
        image: str = None,
    ) -> None:
        with self.connection.cursor() as cursor:
            cursor.execute(
                """SELECT NomeCidade, Estado FROM Totem WHERE Numero_Serie = %s""",
                (totem,),
            )
            totem_result = cursor.fetchone()
            if not totem_result:
                raise HTTPException(
                    status_code=404, detail=f"Totem {totem} não encontrado"
                )

            cidade, estado = totem_result

            cursor.execute(
                """SELECT cd.Sigla
                FROM Categoria_Departamento cd
                INNER JOIN Departamento d ON cd.Sigla = d.Sigla
                WHERE cd.Categoria = %s AND d.NomeCidade = %s AND d.Estado = %s
                LIMIT 1""",
                (category, cidade, estado),
            )
            result = cursor.fetchone()
            sigla = result[0] if result else None

            cursor.execute(
                """INSERT INTO Denuncia
                (Categoria, Usuario, Totem, Data, Coordenadas, Descricao, Valida, Prioridade, Sigla)
                VALUES (%s, %s, %s, CURRENT_DATE, %s, %s, FALSE, 1, %s)""",
                (category, userid, totem, coordenadas, content, sigla),
            )

            cursor.execute(
                """INSERT INTO Historico_Denuncia
                (Usuario, Data_Emissao_Denuncia, Coordenadas, Data_Historico, Status)
                VALUES (%s, CURRENT_DATE, %s, CURRENT_TIMESTAMP, 'Registrada')""",
                (userid, coordenadas),
            )

            if image:
                cursor.execute(
                    """INSERT INTO Midia
                    (URL, Usuario, Data, Coordenadas, Tipo)
                    VALUES (%s, %s, CURRENT_DATE, %s, 'imagem')""",
                    (image, userid, coordenadas),
                )

            self.connection.commit()

    def find_by_area_and_status(
        self, latitude: float, longitude: float, raio: float, categoria: str = None
    ) -> List[Dict[Any, Any]]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            query = """
                WITH UltimoStatus AS (
                    SELECT DISTINCT ON (Usuario, Data_Emissao_Denuncia, Coordenadas)
                        Usuario, Data_Emissao_Denuncia, Coordenadas, Status
                    FROM Historico_Denuncia
                    ORDER BY Usuario, Data_Emissao_Denuncia, Coordenadas, Data_Historico DESC
                )
                SELECT
                    D.*,
                    U.CPF AS CPF_Usuario_Denunciante,

                    US.Status,
                    D.Data AS Data_Registro,
                    U.Nome AS Nome_Usuario_Denunciante
                FROM Denuncia AS D
                JOIN UltimoStatus US ON
                    D.Usuario = US.Usuario AND
                    D.Data = US.Data_Emissao_Denuncia AND
                    D.Coordenadas = US.Coordenadas
                JOIN Usuario AS U ON D.Usuario = U.CPF
                WHERE US.Status IN ('Registrada', 'Em Validação', 'Em Andamento')
            """

            params = []

            if categoria:
                query += " AND D.Categoria = %s"
                params.append(categoria)

            query += """
                AND ST_DWithin(
                    ST_SetSRID(
                        ST_MakePoint(
                            CAST(SUBSTRING(D.Coordenadas FROM 1 FOR POSITION(',' IN D.Coordenadas) - 1) AS DOUBLE PRECISION),
                            CAST(SUBSTRING(D.Coordenadas FROM POSITION(',' IN D.Coordenadas) + 1) AS DOUBLE PRECISION)
                        ),
                        4326
                    )::geography,
                    ST_SetSRID(ST_MakePoint(%s, %s), 4326)::geography,
                    %s
                )
            """
            params.extend([latitude, longitude, raio])

            cursor.execute(query, tuple(params))
            return cursor.fetchall()

    def get_metrics_by_department(self) -> List[Dict[Any, Any]]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                WITH UltimoStatus AS (
                    SELECT DISTINCT ON (Usuario, Data_Emissao_Denuncia, Coordenadas)
                        Usuario, Data_Emissao_Denuncia, Coordenadas, Status
                    FROM Historico_Denuncia
                    ORDER BY Usuario, Data_Emissao_Denuncia, Coordenadas, Data_Historico DESC
                )
                SELECT
                    D.Sigla AS Sigla_Departamento,
                    US.Status AS Status_Atual,
                    COUNT(D.Usuario) AS Total_Denuncias_Por_Status
                FROM Denuncia AS D
                INNER JOIN UltimoStatus US ON
                    D.Usuario = US.Usuario AND
                    D.Data = US.Data_Emissao_Denuncia AND
                    D.Coordenadas = US.Coordenadas
                GROUP BY D.Sigla, US.Status
                ORDER BY D.Sigla, Total_Denuncias_Por_Status DESC
            """)
            return cursor.fetchall()

    def find_most_recent_by_city(
        self, nome_cidade: str, sigla_estado: str
    ) -> List[Dict[Any, Any]]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                WITH UltimoStatus AS (
                    SELECT DISTINCT ON (Usuario, Data_Emissao_Denuncia, Coordenadas)
                        Usuario, Data_Emissao_Denuncia, Coordenadas, Status
                    FROM Historico_Denuncia
                    ORDER BY Usuario, Data_Emissao_Denuncia, Coordenadas, Data_Historico DESC
                )
                SELECT
                    U.Nome AS nome_Usuario,
                    D_RE.Categoria,
                    D_RE.Usuario,
                    D_RE.Totem,
                    D_RE.Data,
                    D_RE.Coordenadas,
                    D_RE.Descricao AS descricao,
                    D_RE.Valida,
                    D_RE.Prioridade,
                    D_RE.Sigla,
                    US.Status,
                    D_RE.Data AS dataRegistro
                FROM Denuncia AS D_RE
                INNER JOIN Usuario AS U ON D_RE.Usuario = U.CPF
                INNER JOIN UltimoStatus US ON
                    D_RE.Usuario = US.Usuario AND
                    D_RE.Data = US.Data_Emissao_Denuncia AND
                    D_RE.Coordenadas = US.Coordenadas
                WHERE D_RE.Data = (
                        SELECT
                            MAX(D_CORR.Data)
                        FROM
                            Denuncia AS D_CORR
                        WHERE
                            D_CORR.Usuario = D_RE.Usuario
                    )
                    AND D_RE.Sigla IN (
                        SELECT
                            Sigla
                        FROM
                            Departamento
                        WHERE
                            NomeCidade = %s
                            AND Estado = %s
                    )
                ORDER BY
                    U.Nome
            """,
                (nome_cidade, sigla_estado),
            )
            return cursor.fetchall()

    def find_all(self) -> List[Dict[Any, Any]]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                WITH UltimoStatus AS (
                    SELECT DISTINCT ON (Usuario, Data_Emissao_Denuncia, Coordenadas)
                        Usuario, Data_Emissao_Denuncia, Coordenadas, Status
                    FROM Historico_Denuncia
                    ORDER BY Usuario, Data_Emissao_Denuncia, Coordenadas, Data_Historico DESC
                )
                SELECT
                    D.Categoria,
                    D.Usuario,
                    D.Data,
                    D.Coordenadas,
                    D.Descricao,
                    D.Valida,
                    D.Prioridade,
                    US.Status,
                    U.Nome AS Nome_Usuario
                FROM Denuncia AS D
                INNER JOIN UltimoStatus US ON
                    D.Usuario = US.Usuario AND
                    D.Data = US.Data_Emissao_Denuncia AND
                    D.Coordenadas = US.Coordenadas
                INNER JOIN Usuario AS U ON D.Usuario = U.CPF
                ORDER BY D.Data DESC
            """)
            return cursor.fetchall()

    def find_by_department(self, sigla_departamento: str) -> List[Dict[Any, Any]]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                WITH UltimoStatus AS (
                    SELECT DISTINCT ON (Usuario, Data_Emissao_Denuncia, Coordenadas)
                        Usuario, Data_Emissao_Denuncia, Coordenadas, Status
                    FROM Historico_Denuncia
                    ORDER BY Usuario, Data_Emissao_Denuncia, Coordenadas, Data_Historico DESC
                )
                SELECT
                    D.Categoria,
                    D.Usuario,
                    D.Data,
                    D.Coordenadas,
                    D.Descricao,
                    D.Valida,
                    D.Prioridade,
                    D.Sigla,
                    US.Status,
                    U.Nome AS Nome_Usuario
                FROM Denuncia AS D
                INNER JOIN UltimoStatus US ON
                    D.Usuario = US.Usuario AND
                    D.Data = US.Data_Emissao_Denuncia AND
                    D.Coordenadas = US.Coordenadas
                INNER JOIN Usuario AS U ON D.Usuario = U.CPF
                WHERE D.Sigla = %s
                  AND US.Status NOT IN ('Resolvida', 'Rejeitada')
                ORDER BY D.Data DESC
            """,
                (sigla_departamento,),
            )
            return cursor.fetchall()

    def find_by_departments(
        self, siglas_departamentos: List[str]
    ) -> List[Dict[Any, Any]]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                WITH UltimoStatus AS (
                    SELECT DISTINCT ON (Usuario, Data_Emissao_Denuncia, Coordenadas)
                        Usuario, Data_Emissao_Denuncia, Coordenadas, Status
                    FROM Historico_Denuncia
                    ORDER BY Usuario, Data_Emissao_Denuncia, Coordenadas, Data_Historico DESC
                )
                SELECT
                    D.Categoria,
                    D.Usuario,
                    D.Data,
                    D.Coordenadas,
                    D.Descricao,
                    D.Valida,
                    D.Prioridade,
                    D.Sigla,
                    US.Status,
                    U.Nome AS Nome_Usuario,
                    (SELECT M.URL
                     FROM Midia M
                     WHERE M.Usuario = D.Usuario
                       AND M.Data = D.Data
                       AND M.Coordenadas = D.Coordenadas
                     LIMIT 1) AS Imagem
                FROM Denuncia AS D
                INNER JOIN UltimoStatus US ON
                    D.Usuario = US.Usuario AND
                    D.Data = US.Data_Emissao_Denuncia AND
                    D.Coordenadas = US.Coordenadas
                INNER JOIN Usuario AS U ON D.Usuario = U.CPF
                WHERE D.Sigla = ANY(%s)
                  AND US.Status NOT IN ('Resolvida', 'Rejeitada')
                ORDER BY D.Data DESC
            """,
                (siglas_departamentos,),
            )
            return cursor.fetchall()

    def count_by_status(self, status: str) -> int:
        with self.connection.cursor() as cursor:
            cursor.execute(
                """
                WITH UltimoStatus AS (
                    SELECT DISTINCT ON (Usuario, Data_Emissao_Denuncia, Coordenadas)
                        Usuario, Data_Emissao_Denuncia, Coordenadas, Status
                    FROM Historico_Denuncia
                    ORDER BY Usuario, Data_Emissao_Denuncia, Coordenadas, Data_Historico DESC
                )
                SELECT COUNT(*)
                FROM Denuncia AS D
                INNER JOIN UltimoStatus US ON
                    D.Usuario = US.Usuario AND
                    D.Data = US.Data_Emissao_Denuncia AND
                    D.Coordenadas = US.Coordenadas
                WHERE US.Status = %s
            """,
                (status,),
            )
            result = cursor.fetchone()
            return result[0] if result else 0

    def find_by_id(
        self, usuario: str, data: str, coordenadas: str
    ) -> Dict[Any, Any] | None:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            # Primeiro, buscar os dados principais da denúncia
            cursor.execute(
                """
                SELECT
                    D.Categoria AS categoria,
                    D.Usuario AS usuario,
                    D.Totem AS totem,
                    D.Data AS data,
                    D.Coordenadas AS coordenadas,
                    D.Descricao AS descricao,
                    D.Valida AS valida,
                    D.Prioridade AS prioridade,
                    D.Sigla AS sigla,
                    U.Nome AS nome_usuario,
                    U.Email AS email_usuario,
                    T.NomeCidade AS cidade_totem,
                    T.Estado AS estado_totem,
                    DEP.Nome AS nome_departamento
                FROM
                    Denuncia AS D
                INNER JOIN
                    Usuario AS U ON D.Usuario = U.CPF
                INNER JOIN
                    Totem AS T ON D.Totem = T.Numero_Serie
                LEFT JOIN
                    Departamento AS DEP ON D.Sigla = DEP.Sigla
                WHERE
                    D.Usuario = %s
                    AND D.Data = %s
                    AND D.Coordenadas = %s
            """,
                (usuario, data, coordenadas),
            )
            denuncia = cursor.fetchone()

            if not denuncia:
                return None

            # Buscar todo o histórico de status
            cursor.execute(
                """
                SELECT
                    H.Status AS status,
                    H.Data_Historico AS data_historico
                FROM
                    Historico_Denuncia AS H
                WHERE
                    H.Usuario = %s
                    AND H.Data_Emissao_Denuncia = %s
                    AND H.Coordenadas = %s
                ORDER BY H.Data_Historico DESC
            """,
                (usuario, data, coordenadas),
            )
            historico = cursor.fetchall()

            # Adicionar o histórico ao resultado
            result = dict(denuncia)
            result["historico"] = historico
            # Adicionar o status mais recente para compatibilidade
            result["status"] = historico[0]["status"] if historico else None
            result["data_historico"] = (
                historico[0]["data_historico"] if historico else None
            )

            return result

    def get_current_status(self, usuario: str, data: str, coordenadas: str) -> str:
        with self.connection.cursor() as cursor:
            cursor.execute(
                """SELECT Status FROM Historico_Denuncia
                WHERE Usuario = %s AND Data_Emissao_Denuncia = %s AND Coordenadas = %s
                ORDER BY Data_Historico DESC
                LIMIT 1""",
                (usuario, data, coordenadas),
            )
            result = cursor.fetchone()
            return result[0] if result else None

    def update_status(
        self,
        usuario: str,
        data: str,
        coordenadas: str,
        novo_status: str,
        matricula_funcionario: str,
    ) -> None:
        with self.connection.cursor() as cursor:
            cursor.execute(
                """INSERT INTO Historico_Denuncia
                (Usuario, Data_Emissao_Denuncia, Coordenadas, Data_Historico, Status)
                VALUES (%s, %s, %s, CURRENT_TIMESTAMP, %s)""",
                (usuario, data, coordenadas, novo_status),
            )

            # Registra na tabela FuncionarioDenuncia
            cursor.execute(
                """INSERT INTO FuncionarioDenuncia
                (Matricula, Usuario_Denunciante, Data_Denuncia, Coordenadas, Atuacao)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (Matricula, Usuario_Denunciante, Data_Denuncia, Coordenadas)
                DO UPDATE SET Atuacao = EXCLUDED.Atuacao""",
                (matricula_funcionario, usuario, data, coordenadas, novo_status),
            )

            self.connection.commit()
