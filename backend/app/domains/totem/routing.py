from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.database import get_db_connection
from app.domains.totem.repository import TotemRepository
from app.domains.totem.controller import TotemController

router = APIRouter(prefix="/totem", tags=["totem"])

class VerifyDistanceRequest(BaseModel):
    latitude: float
    longitude: float

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
def verify_distance(numero_serie: str, request: VerifyDistanceRequest, conn=Depends(get_db_connection)):
    repository = TotemRepository(conn)
    controller = TotemController(repository)
    return controller.verify_distance(numero_serie, request.latitude, request.longitude)
