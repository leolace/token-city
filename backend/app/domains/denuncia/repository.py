from typing import Any, Dict, List

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
            # Buscar cidade e estado do totem
            cursor.execute(
                """SELECT NomeCidade, Estado FROM Totem WHERE Numero_Serie = %s""",
                (totem,),
            )
            totem_result = cursor.fetchone()
            if not totem_result:
                raise ValueError(f"Totem {totem} não encontrado")

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
                VALUES (%s, CURRENT_DATE, %s, CURRENT_DATE, 'Registrada')""",
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
                SELECT
                    D.*,
                    U.CPF AS CPF_Usuario_Denunciante,
                    HD.Status,
                    D.Data AS Data_Registro,
                    U.Nome AS Nome_Usuario_Denunciante
                FROM
                    Denuncia AS D
                JOIN
                    Historico_Denuncia AS HD ON
                        D.Usuario = HD.Usuario AND
                        D.Data = HD.Data_Emissao_Denuncia AND
                        D.Coordenadas = HD.Coordenadas
                JOIN
                    Usuario AS U ON D.Usuario = U.CPF
                WHERE
                    HD.Status IN ('Registrada', 'Em Validação', 'Em Andamento')
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
                SELECT
                    D.Sigla AS Sigla_Departamento,
                    H.Status AS Status_Atual,
                    COUNT(D.Usuario) AS Total_Denuncias_Por_Status
                FROM
                    Denuncia AS D
                INNER JOIN
                    Historico_Denuncia AS H
                    ON D.Usuario = H.Usuario
                    AND D.Data = H.Data_Emissao_Denuncia
                    AND D.Coordenadas = H.Coordenadas
                GROUP BY
                    D.Sigla,
                    H.Status
                ORDER BY
                    D.Sigla,
                    Total_Denuncias_Por_Status DESC
            """)
            return cursor.fetchall()

    def find_most_recent_by_city(
        self, nome_cidade: str, sigla_estado: str
    ) -> List[Dict[Any, Any]]:
        with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT
                    U.Nome AS nomeDenunciante,
                    D_RE.*,
                    D_RE.Descricao AS descricao,
                    H.Status AS statusAtual,
                    D_RE.Data AS dataRegistro
                FROM
                    Denuncia AS D_RE
                INNER JOIN
                    Usuario AS U ON D_RE.Usuario = U.CPF
                INNER JOIN
                    Historico_Denuncia AS H
                    ON D_RE.Usuario = H.Usuario
                    AND D_RE.Data = H.Data_Emissao_Denuncia
                    AND D_RE.Coordenadas = H.Coordenadas
                WHERE
                    D_RE.Data = (
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
                SELECT
                    D.Categoria,
                    D.Usuario,
                    D.Data,
                    D.Coordenadas,
                    D.Descricao,
                    D.Valida,
                    D.Prioridade,
                    H.Status,
                    U.Nome AS NomeUsuario
                FROM
                    Denuncia AS D
                INNER JOIN
                    Historico_Denuncia AS H
                    ON D.Usuario = H.Usuario
                    AND D.Data = H.Data_Emissao_Denuncia
                    AND D.Coordenadas = H.Coordenadas
                INNER JOIN
                    Usuario AS U ON D.Usuario = U.CPF
                ORDER BY D.Data DESC
            """)
            return cursor.fetchall()

    def count_by_status(self, status: str) -> int:
        with self.connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT COUNT(*)
                FROM Denuncia AS D
                INNER JOIN Historico_Denuncia AS H
                    ON D.Usuario = H.Usuario
                    AND D.Data = H.Data_Emissao_Denuncia
                    AND D.Coordenadas = H.Coordenadas
                WHERE H.Status = %s
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
