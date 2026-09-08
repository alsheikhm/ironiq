from fastapi import FastAPI

from app import models
from app.database import Base, engine
from app.routers.workouts import router as workouts_router


app = FastAPI(title="IronIQ API")


Base.metadata.create_all(bind=engine)


app.include_router(workouts_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}