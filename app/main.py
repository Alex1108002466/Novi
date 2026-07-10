from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import categories, locations, routes, scenarios

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MIU Guide API",
    description="Бэкенд цифрового помощника Novi для навигации новичков по ММУ",
    version="0.1.0",
)

# CORS открыт полностью — для хакатона фронт может быть на любом localhost-порту.
# Перед продом сузить allow_origins до конкретного домена.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(categories.router)
app.include_router(locations.router)
app.include_router(routes.router)
app.include_router(scenarios.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}