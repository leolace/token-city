from fastapi import APIRouter, Depends
from app.database import get_db_connection
from app.domains.departamento.repository import DepartamentoRepository
from app.domains.departamento.controller import DepartamentoController

router = APIRouter(prefix="/departamentos", tags=["departamento"])

@router.get("/atende-todas-denuncias")
def get_all_category_handlers(conn=Depends(get_db_connection)):
    repository = DepartamentoRepository(conn)
    controller = DepartamentoController(repository)
    return controller.get_all_category_handlers()
