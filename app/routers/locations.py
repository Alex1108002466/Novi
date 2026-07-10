from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/locations", tags=["locations"])


@router.get("", response_model=list[schemas.LocationOut])
def list_locations(
    category: Optional[str] = None,
    floor: Optional[int] = None,
    entry_points_only: bool = False,
    db: Session = Depends(get_db),
):
    """
    Список локаций с фильтрами:
    - category=library      -> точки конкретной категории (экран 'Что ты хочешь найти?')
    - floor=1                -> точки конкретного этажа (экран 'Где ты сейчас?')
    - entry_points_only=true -> только точки, которые можно выбрать как 'я сейчас здесь'
    """
    query = db.query(models.Location)

    if category:
        query = query.join(models.Category).filter(models.Category.slug == category)
    if floor is not None:
        query = query.filter(models.Location.floor == floor)
    if entry_points_only:
        query = query.filter(models.Location.is_entry_point == 1)

    return query.all()


@router.get("/{location_id}", response_model=schemas.LocationOut)
def get_location(location_id: int, db: Session = Depends(get_db)):
    location = db.query(models.Location).filter(models.Location.id == location_id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Локация не найдена")
    return location