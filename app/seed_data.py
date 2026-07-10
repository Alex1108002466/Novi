"""
Наполняет БД тестовыми данными: категории, локации, рёбра графа, один сценарий.
Данные условные (для демо/разработки) — когда будет реальный план корпуса,
координаты (x, y), этажи и веса рёбер (расстояния) нужно будет заменить на настоящие.

Запуск:  python -m app.seed_data
"""
from app.database import Base, engine, SessionLocal
from app import models


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Если уже есть данные — не дублируем при повторном запуске
    if db.query(models.Category).first():
        print("Данные уже есть в БД, пропускаю сидинг.")
        db.close()
        return

    # ---- Категории (экран "Что ты хочешь найти?") ----
    categories = {
        "deanery": models.Category(slug="deanery", title="Деканат", icon="🏢"),
        "library": models.Category(slug="library", title="Библиотека", icon="📚"),
        "canteen": models.Category(slug="canteen", title="Столовая", icon="🍽️"),
        "atrium": models.Category(slug="atrium", title="Атриум", icon="🛋️"),
        "restroom": models.Category(slug="restroom", title="Санузлы", icon="🚻"),
        "department": models.Category(slug="department", title="Кафедра", icon="🎓"),
        "computer_lab": models.Category(slug="computer_lab", title="Компьютерные классы", icon="💻"),
        "audience": models.Category(slug="audience", title="Аудитории", icon="🚪"),
        "cafe": models.Category(slug="cafe", title="Кофейня", icon="☕"),
    }
    db.add_all(categories.values())
    db.flush()

    # ---- Локации ----
    # floor 1
    main_entrance = models.Location(name="Главный вход", floor=1, x=10, y=90, is_entry_point=1)
    atrium = models.Location(name="Атриум", floor=1, x=30, y=80, is_entry_point=1, category_id=categories["atrium"].id)
    corridor_1 = models.Location(name="Коридор 1 этажа", floor=1, x=50, y=70, is_entry_point=1)
    library = models.Location(name="Библиотека", room_number="115", floor=1, x=20, y=40,
                               category_id=categories["library"].id)
    canteen = models.Location(name="Столовая", room_number="103", floor=1, x=70, y=40,
                               category_id=categories["canteen"].id)
    restroom = models.Location(name="Санузлы", room_number="112", floor=1, x=40, y=30,
                                category_id=categories["restroom"].id)
    cafe = models.Location(name="Кофейня", floor=1, x=60, y=30, category_id=categories["cafe"].id)
    audience_102 = models.Location(name="Аудитория 102", room_number="102", floor=1, x=80, y=60,
                                    category_id=categories["audience"].id)
    stairs_1 = models.Location(name="Лестница №1", floor=1, x=50, y=50, is_entry_point=1)
    elevator = models.Location(name="Лифт", floor=1, x=55, y=55, is_entry_point=1)

    # floor 2
    corridor_2 = models.Location(name="Коридор 2 этажа", floor=2, x=50, y=70, is_entry_point=1)
    deanery = models.Location(name="Деканат", room_number="201", floor=2, x=20, y=40,
                               category_id=categories["deanery"].id)
    computer_lab = models.Location(name="Компьютерный класс", room_number="208", floor=2, x=70, y=40,
                                    category_id=categories["computer_lab"].id)
    stairs_2 = models.Location(name="Лестница №2", floor=2, x=50, y=50, is_entry_point=1)

    # floor 3
    corridor_3 = models.Location(name="Коридор 3 этажа", floor=3, x=50, y=70, is_entry_point=1)
    department = models.Location(name="Кафедра", room_number="305", floor=3, x=30, y=40,
                                  category_id=categories["department"].id)

    all_locations = [
        main_entrance, atrium, corridor_1, library, canteen, restroom, cafe, audience_102, stairs_1, elevator,
        corridor_2, deanery, computer_lab, stairs_2,
        corridor_3, department,
    ]
    db.add_all(all_locations)
    db.flush()

    # ---- Рёбра графа (вес = условное расстояние в метрах) ----
    def edge(a, b, weight):
        db.add(models.Edge(from_location_id=a.id, to_location_id=b.id, weight=weight))

    # floor 1
    edge(main_entrance, atrium, 10)
    edge(atrium, corridor_1, 5)
    edge(corridor_1, library, 15)
    edge(corridor_1, canteen, 20)
    edge(corridor_1, restroom, 8)
    edge(corridor_1, cafe, 12)
    edge(corridor_1, audience_102, 10)
    edge(corridor_1, stairs_1, 5)
    edge(corridor_1, elevator, 7)

    # вертикальные переходы
    edge(stairs_1, corridor_2, 12)     # лестница №1: этаж 1 -> 2
    edge(stairs_2, corridor_2, 3)      # лестница №2 примыкает к коридору 2 этажа
    edge(stairs_2, corridor_3, 12)     # лестница №2: этаж 2 -> 3
    edge(elevator, corridor_2, 6)      # лифт быстрее лестницы
    edge(elevator, corridor_3, 10)     # лифт может ехать сразу на 3 этаж

    # floor 2
    edge(corridor_2, deanery, 15)
    edge(corridor_2, computer_lab, 15)

    # floor 3
    edge(corridor_3, department, 10)

    db.flush()

    # ---- Сценарий "Первый день в ММУ" (MVP-требование брифа) ----
    scenario = models.Scenario(
        slug="first_day",
        title="Первый день в ММУ",
        description="Знакомство с университетом для нового студента",
    )
    db.add(scenario)
    db.flush()

    steps = [
        models.ScenarioStep(
            scenario_id=scenario.id, order=1,
            message="Привет! Я Novi 👋 Давай для начала найдём деканат — там тебе оформят студенческий.",
            target_location_id=deanery.id,
        ),
        models.ScenarioStep(
            scenario_id=scenario.id, order=2,
            message="Отлично! Теперь загляни в библиотеку — возьмёшь учебники на семестр.",
            target_location_id=library.id,
        ),
        models.ScenarioStep(
            scenario_id=scenario.id, order=3,
            message="Осталось найти свою кафедру — там куратор группы ответит на оставшиеся вопросы.",
            target_location_id=department.id,
        ),
    ]
    db.add_all(steps)

    db.commit()
    db.close()
    print("Сидинг завершён: категории, локации, рёбра графа и сценарий 'Первый день' созданы.")


if __name__ == "__main__":
    seed()