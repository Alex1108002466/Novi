from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.database import Base


class Category(Base):
    """Категория для меню 'Что ты хочешь найти?' (Деканат, Библиотека, ...)."""
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    icon = Column(String, nullable=True)

    locations = relationship("Location", back_populates="category")


class Location(Base):
    """Точка на карте: аудитория, служебное помещение, лестница, коридор и т.д."""
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    room_number = Column(String, nullable=True)
    floor = Column(Integer, nullable=False, default=1)
    x = Column(Float, nullable=True)
    y = Column(Float, nullable=True)
    is_entry_point = Column(Integer, default=0)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)

    category = relationship("Category", back_populates="locations")


class Edge(Base):
    """Ребро графа: связь между двумя точками (коридор, переход, лестница) с весом."""
    __tablename__ = "edges"

    id = Column(Integer, primary_key=True, index=True)
    from_location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    to_location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    weight = Column(Float, nullable=False, default=1.0)

    from_location = relationship("Location", foreign_keys=[from_location_id])
    to_location = relationship("Location", foreign_keys=[to_location_id])


class Scenario(Base):
    """Сценарий-квест (Target-уровень): 'Первый день в ММУ', 'Сессия!' и т.д."""
    __tablename__ = "scenarios"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    steps = relationship("ScenarioStep", back_populates="scenario", order_by="ScenarioStep.order")


class ScenarioStep(Base):
    """Шаг сценария: реплика персонажа + опциональная целевая локация."""
    __tablename__ = "scenario_steps"

    id = Column(Integer, primary_key=True, index=True)
    scenario_id = Column(Integer, ForeignKey("scenarios.id"), nullable=False)
    order = Column(Integer, nullable=False)
    message = Column(Text, nullable=False)
    target_location_id = Column(Integer, ForeignKey("locations.id"), nullable=True)

    scenario = relationship("Scenario", back_populates="steps")
    target_location = relationship("Location")