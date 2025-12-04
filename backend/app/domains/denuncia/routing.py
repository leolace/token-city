from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.database import get_db_connection
from app.domains.denuncia.controller import DenunciaController
from app.domains.denuncia.repository import DenunciaRepository
from app.domains.denunciante.repository import DenuncianteRepository

router = APIRouter(prefix="/denuncia", tags=["denuncia"])


class Coordinates(BaseModel):
    latitude: float
    longitude: float


class CreateDenunciaRequest(BaseModel):
    userid: str
    content: str
    category: str
    totem: str
    coordinates: Coordinates
    image: Optional[str] = None


class DenunciasByAreaRequest(BaseModel):
    coordinates: Coordinates
    radius: float
    category: Optional[str] = None


class UpdateStatusRequest(BaseModel):
    usuario: str
    data: str
    coordenadas: str
    novo_status: str
    matricula_funcionario: str


@router.post("", status_code=201, response_model=None)
def create_denuncia(request: CreateDenunciaRequest, conn=Depends(get_db_connection)):
    repository = DenunciaRepository(conn)
    controller = DenunciaController(repository)
    coordenadas_str = f"{request.coordinates.latitude},{request.coordinates.longitude}"
    return controller.create_denuncia(
        request.userid,
        request.category,
        request.content,
        request.totem,
        coordenadas_str,
        request.image,
    )


@router.post("/pendentes")
def get_denuncias_pendentes(
    request: DenunciasByAreaRequest, conn=Depends(get_db_connection)
):
    repository = DenunciaRepository(conn)
    controller = DenunciaController(repository)
    return controller.get_denuncias_by_area(
        request.coordinates.latitude,
        request.coordinates.longitude,
        request.radius,
        request.category,
    )


@router.get("/metricas/por-departamento-status")
def get_metrics_by_department(conn=Depends(get_db_connection)):
    repository = DenunciaRepository(conn)
    controller = DenunciaController(repository)
    return controller.get_metrics_by_department()


@router.get("/mais-recentes/{state}/{city}")
def get_most_recent_by_city(state: str, city: str, conn=Depends(get_db_connection)):
    repository = DenunciaRepository(conn)
    controller = DenunciaController(repository)
    return controller.get_most_recent_by_city(city, state)


@router.get("/all")
def get_all_denuncias(conn=Depends(get_db_connection)):
    repository = DenunciaRepository(conn)
    return repository.find_all()


@router.get("/departamento/{sigla}")
def get_denuncias_by_department(sigla: str, conn=Depends(get_db_connection)):
    repository = DenunciaRepository(conn)
    return repository.find_by_department(sigla)


@router.post("/departamentos")
def get_denuncias_by_departments(siglas: list[str], conn=Depends(get_db_connection)):
    repository = DenunciaRepository(conn)
    return repository.find_by_departments(siglas)


@router.get("/count/resolvidas")
def count_denuncias_resolvidas(conn=Depends(get_db_connection)):
    repository = DenunciaRepository(conn)
    count = repository.count_by_status("Resolvida")
    return {"count": count}


@router.get("/count/pendentes")
def count_denuncias_pendentes(conn=Depends(get_db_connection)):
    repository = DenunciaRepository(conn)
    total = (
        repository.count_by_status("Registrada")
        + repository.count_by_status("Em Validação")
        + repository.count_by_status("Em Andamento")
    )
    return {"count": total}


@router.get("/{usuario}/{data}/{coordenadas}")
def get_denuncia_by_id(
    usuario: str, data: str, coordenadas: str, conn=Depends(get_db_connection)
):
    repository = DenunciaRepository(conn)
    controller = DenunciaController(repository)
    return controller.get_denuncia_by_id(usuario, data, coordenadas)
@router.patch("/status")
def update_status(request: UpdateStatusRequest, conn=Depends(get_db_connection)):
    denuncia_repository = DenunciaRepository(conn)
    denunciante_repository = DenuncianteRepository(conn)
    controller = DenunciaController(denuncia_repository, denunciante_repository)
    return controller.update_status(
        request.usuario, request.data, request.coordenadas, request.novo_status, request.matricula_funcionario
    )
