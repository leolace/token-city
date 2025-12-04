from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.database import get_db_connection
from app.domains.totem.controller import TotemController
from app.domains.totem.repository import TotemRepository

router = APIRouter(prefix="/totem", tags=["totem"])


class VerifyDistanceRequest(BaseModel):
    latitude: float
    longitude: float


class CreateTotemRequest(BaseModel):
    numero_serie: str
    nome_cidade: str
    estado: str
    latitude: float
    longitude: float
    status: str
    data_instalacao: str


@router.post("", status_code=201, response_model=None)
def create_totem(request: CreateTotemRequest, conn=Depends(get_db_connection)):
    repository = TotemRepository(conn)
    controller = TotemController(repository)
    coordenadas_str = f"{request.latitude},{request.longitude}"
    return controller.create_totem(
        request.numero_serie,
        request.nome_cidade,
        request.estado,
        coordenadas_str,
        request.status,
        request.data_instalacao,
    )


@router.get("")
def get_all_totems(conn=Depends(get_db_connection)):
    repository = TotemRepository(conn)
    controller = TotemController(repository)
    return controller.get_all_totems()


@router.get("/{numero_serie}")
def get_totem(numero_serie: str, conn=Depends(get_db_connection)):
    repository = TotemRepository(conn)
    controller = TotemController(repository)
    return controller.get_totem(numero_serie)


@router.post("/{numero_serie}")
def verify_distance(
    numero_serie: str, request: VerifyDistanceRequest, conn=Depends(get_db_connection)
):
    repository = TotemRepository(conn)
    controller = TotemController(repository)
    return controller.verify_distance(numero_serie, request.latitude, request.longitude)


@router.delete("/{numero_serie}", status_code=200)
def delete_totem(numero_serie: str, conn=Depends(get_db_connection)):
    repository = TotemRepository(conn)
    controller = TotemController(repository)
    return controller.delete_totem(numero_serie)
