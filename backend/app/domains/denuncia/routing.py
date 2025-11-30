from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from app.database import get_db_connection
from app.domains.denuncia.repository import DenunciaRepository
from app.domains.denuncia.controller import DenunciaController

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
    city: str
    state: str
    image: Optional[str] = None

class DenunciasByAreaRequest(BaseModel):
    coordinates: Coordinates
    radius: float
    category: Optional[str] = None

class MostRecentByCityRequest(BaseModel):
    city: str
    state: str

@router.post("")
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
        request.city,
        request.state,
        request.image
    )

@router.post("/pendentes")
def get_denuncias_pendentes(request: DenunciasByAreaRequest, conn=Depends(get_db_connection)):
    repository = DenunciaRepository(conn)
    controller = DenunciaController(repository)
    return controller.get_denuncias_by_area(
        request.coordinates.latitude,
        request.coordinates.longitude,
        request.radius,
        request.category
    )

@router.get("/metricas/por-departamento-status")
def get_metrics_by_department(conn=Depends(get_db_connection)):
    repository = DenunciaRepository(conn)
    controller = DenunciaController(repository)
    return controller.get_metrics_by_department()

@router.post("/mais-recentes")
def get_most_recent_by_city(request: MostRecentByCityRequest, conn=Depends(get_db_connection)):
    repository = DenunciaRepository(conn)
    controller = DenunciaController(repository)
    return controller.get_most_recent_by_city(request.city, request.state)
