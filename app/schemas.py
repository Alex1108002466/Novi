from typing import Optional
from pydantic import BaseModel


class CategoryOut(BaseModel):
    id: int
    slug: str
    title: str
    icon: Optional[str] = None

    class Config:
        from_attributes = True


class LocationOut(BaseModel):
    id: int
    name: str
    room_number: Optional[str] = None
    floor: int
    x: Optional[float] = None
    y: Optional[float] = None
    is_entry_point: int
    category_id: Optional[int] = None

    class Config:
        from_attributes = True


class RouteStep(BaseModel):
    location: LocationOut
    distance_from_start: float  # накопленное расстояние от старта до этой точки


class RouteOut(BaseModel):
    from_location: LocationOut
    to_location: LocationOut
    path: list[RouteStep]
    total_distance: float
    estimated_time_minutes: float


class ScenarioStepOut(BaseModel):
    id: int
    order: int
    message: str
    target_location: Optional[LocationOut] = None

    class Config:
        from_attributes = True


class ScenarioOut(BaseModel):
    id: int
    slug: str
    title: str
    description: Optional[str] = None
    steps: list[ScenarioStepOut]

    class Config:
        from_attributes = True