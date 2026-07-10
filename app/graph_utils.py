import networkx as nx
from sqlalchemy.orm import Session

from app import models


def build_graph(db: Session) -> nx.Graph:
    """Строит неориентированный взвешенный граф из таблицы edges.

    Граф пересобирается на каждый запрос — для масштаба одного здания
    это стоит копейки по CPU, зато не нужно думать про инвалидацию кэша,
    когда кто-то поменяет данные в БД (например, добавит новую аудиторию).
    Если карта вырастет (несколько корпусов) — можно закэшировать граф
    и сбрасывать кэш по событию изменения edges/locations.
    """
    graph = nx.Graph()

    locations = db.query(models.Location).all()
    for loc in locations:
        graph.add_node(loc.id)

    edges = db.query(models.Edge).all()
    for edge in edges:
        graph.add_edge(edge.from_location_id, edge.to_location_id, weight=edge.weight)

    return graph


def shortest_path(db: Session, from_id: int, to_id: int) -> tuple[list[int], float]:
    """Возвращает (список id локаций по пути, суммарный вес) или ([], -1) если пути нет."""
    graph = build_graph(db)

    if from_id not in graph or to_id not in graph:
        return [], -1

    try:
        path = nx.shortest_path(graph, source=from_id, target=to_id, weight="weight")
        length = nx.shortest_path_length(graph, source=from_id, target=to_id, weight="weight")
        return path, length
    except nx.NetworkXNoPath:
        return [], -1