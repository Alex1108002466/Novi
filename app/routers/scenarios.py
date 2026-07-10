from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/scenarios", tags=["scenarios"])


@router.get("", response_model=list[schemas.ScenarioOut])
def list_scenarios(db: Session = Depends(get_db)):
    """Список доступных сценариев ('Первый день в ММУ', 'Сессия!' и т.д.)."""
    return db.query(models.Scenario).all()


@router.get("/{scenario_id}", response_model=schemas.ScenarioOut)
def get_scenario(scenario_id: int, db: Session = Depends(get_db)):
    scenario = db.query(models.Scenario).filter(models.Scenario.id == scenario_id).first()
    if not scenario:
        raise HTTPException(status_code=404, detail="Сценарий не найден")
    return scenario