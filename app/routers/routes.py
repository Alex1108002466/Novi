import math

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas, graph_utils
from app.database import get_db

router = APIRouter(prefix="/route", tags=["route"])

# Условная скорость перемещения по зданию (с учётом лестниц, дверей и т.д.)
# Подобрано так, чтобы совпадать с примером на макете: ~40 м -> ~1 мин.
WALK_SPEED_M_PER_MIN = 40


@router.get("", response_model=schemas.RouteOut)
def get_route(from_id: int, to_id: int, db: Session = Depends(get_db)):
    """Строит кратчайший маршрут между двумя локациями (алгоритм Дейкстры через networkx)."""
    from_location = db.query(models.Location).filter(models.Location.id == from_id).first()
    to_location = db.query(models.Location).filter(models.Location.id == to_id).first()

    if not from_location or not to_location:
        raise HTTPException(status_code=404, detail="Одна из локаций не найдена")

    path_ids, total_distance = graph_utils.shortest_path(db, from_id, to_id)

    if not path_ids:
        raise HTTPException(
            status_code=404,
            detail="Маршрут между этими точками не найден — проверь, что граф связный (таблица edges)",
        )

    # Собираем накопленное расстояние по пути, чтобы фронт мог рисовать прогресс
    graph = graph_utils.build_graph(db)
    steps: list[schemas.RouteStep] = []
    accumulated = 0.0

    locations_by_id = {loc.id: loc for loc in db.query(models.Location).filter(models.Location.id.in_(path_ids))}

    for i, loc_id in enumerate(path_ids):
        if i > 0:
            accumulated += graph[path_ids[i - 1]][loc_id]["weight"]
        steps.append(
            schemas.RouteStep(location=locations_by_id[loc_id], distance_from_start=accumulated)
        )

    estimated_minutes = max(1, math.ceil(total_distance / WALK_SPEED_M_PER_MIN))

    return schemas.RouteOut(
        from_location=from_location,
        to_location=to_location,
        path=steps,
        total_distance=total_distance,
        estimated_time_minutes=estimated_minutes,
    )