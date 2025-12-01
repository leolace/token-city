from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.domains.totem.routing import router as totem_router
from app.domains.usuario.routing import router as usuario_router
from app.domains.denuncia.routing import router as denuncia_router
from app.domains.recompensa.routing import router as recompensa_router
from app.domains.departamento.routing import router as departamento_router

app = FastAPI(title="Projeto BD API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()

app.include_router(totem_router)
app.include_router(usuario_router)
app.include_router(denuncia_router)
app.include_router(recompensa_router)
app.include_router(departamento_router)

@app.get("/")
def read_root():
    return {"message": "API rodando com sucesso"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
