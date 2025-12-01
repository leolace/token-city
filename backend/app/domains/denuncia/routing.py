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

@router.get("/all")
def get_all_denuncias(conn=Depends(get_db_connection)):
    repository = DenunciaRepository(conn)
    return repository.find_all()

@router.get("/count/resolvidas")
def count_denuncias_resolvidas(conn=Depends(get_db_connection)):
    repository = DenunciaRepository(conn)
    count = repository.count_by_status("Resolvida")
    return {"count": count}

@router.get("/count/pendentes")
def count_denuncias_pendentes(conn=Depends(get_db_connection)):
    repository = DenunciaRepository(conn)
    # Contar denúncias com status diferente de 'Resolvida'
    total = repository.count_by_status("Registrada") + repository.count_by_status("Em Validação") + repository.count_by_status("Em Andamento")
    return {"count": total}
