from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


def create():
    from timetable.models import models

    models.Base.metadata.create_all(engine)


engine = create_engine('sqlite:///timetable.db', connect_args={'check_same_thread': False})

DBSession = sessionmaker(bind=engine)
session = DBSession()
