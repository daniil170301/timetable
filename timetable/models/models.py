from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Lesson(Base):
    __tablename__ = 'lesson'

    id = Column(Integer, primary_key=True)

    day = Column(Integer, nullable=False)
    parity = Column(Integer, nullable=False)
    number = Column(Integer, nullable=False)
    type = Column(Integer, nullable=False)

    subject_id = Column(Integer, ForeignKey('subject.id'), default=None)
    teacher_id = Column(Integer, ForeignKey('teacher.id'), default=None)
    audience_id = Column(Integer, ForeignKey('audience.id'), default=None)
    group_id = Column(Integer, ForeignKey('group.id'), nullable=False)
    subgroup_id = Column(Integer, ForeignKey('subgroup.id'), default=None)

    subject = relationship('Subject', lazy='joined')
    teacher = relationship('Teacher', back_populates='lessons')
    audience = relationship('Audience', back_populates='lessons')
    group = relationship('Group', back_populates='lessons')
    subgroup = relationship('Subgroup', back_populates='lessons')

    def __str__(self):
        return 'Lesson {}'.format(self.id)


class Subject(Base):
    __tablename__ = 'subject'

    id = Column(Integer, primary_key=True)

    name = Column(String, nullable=False)
    short_name = Column(String, nullable=False)

    teacher_id = Column(Integer, ForeignKey('teacher.id'), default=None)
    teacher = relationship('Teacher', back_populates='subjects')

    def __str__(self):
        return self.short_name


class Teacher(Base):
    __tablename__ = 'teacher'

    id = Column(Integer, primary_key=True)

    second_name = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    middle_name = Column(String, nullable=False)

    subjects = relationship('Subject')
    lessons = relationship('Lesson', order_by='Lesson.day.asc()')

    def __str__(self):
        return self.second_name + ' ' + self.first_name[0] + '.' + self.middle_name[0]


class Audience(Base):
    __tablename__ = 'audience'

    id = Column(Integer, primary_key=True)

    number = Column(String, nullable=False)

    lessons = relationship('Lesson', order_by='Lesson.day.asc()')

    def __str__(self):
        return self.number


class Faculty(Base):
    __tablename__ = 'faculty'

    id = Column(Integer, primary_key=True)

    name = Column(String, nullable=False)
    short_name = Column(String, nullable=False)

    courses = relationship('Course', back_populates='faculty', order_by='Course.number.asc()')

    def __str__(self):
        return self.short_name


class Course(Base):
    __tablename__ = 'course'

    id = Column(Integer, primary_key=True)

    number = Column(String, nullable=False)
    direction = Column(String, nullable=False)

    faculty_id = Column(Integer, ForeignKey('faculty.id'), default=None)
    faculty = relationship('Faculty', back_populates='courses')
    groups = relationship('Group', back_populates='course', order_by='Group.number.asc()')

    def __str__(self):
        return self.direction + ' ' + self.number + ' курс'


class Group(Base):
    __tablename__ = 'group'

    id = Column(Integer, primary_key=True)

    number = Column(String, nullable=False)

    course_id = Column(Integer, ForeignKey('course.id'), default=None)
    course = relationship('Course', back_populates='groups')
    subgroups = relationship('Subgroup', back_populates='group', order_by='Subgroup.number.desc()')
    lessons = relationship('Lesson', order_by='Lesson.day.asc()')

    def __str__(self):
        return self.number


class Subgroup(Base):
    __tablename__ = 'subgroup'

    id = Column(Integer, primary_key=True)

    number = Column(String, nullable=False)

    group_id = Column(Integer, ForeignKey('group.id'), default=None)
    group = relationship('Group', back_populates='subgroups')
    lessons = relationship('Lesson', order_by='Lesson.day.asc()')

    def __str__(self):
        return self.number