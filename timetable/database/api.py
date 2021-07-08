from db import session
from timetable.models.models import Lesson, Subject, Teacher, Audience, Faculty, Course, Group, Subgroup


# Help functions
def empty_timetable():
    """
    Функция возвращает пустой массив расписания
    """
    timetable = []

    for day in range(6):
        timetable.append([])
        for parity in range(2):
            timetable[day].append([])
            for number in range(8):
                timetable[day][parity].append(None)

    return timetable


# Get functions
def get_timetable(flag, info):
    """
    Функция получения расписания

    :param flag: строка group/subgroup/teacher/audience в зависимости от необходимого расписания
    :param info: Для group: id группы, str
                 Для subgroup: id подгруппы, str
                 Для teacher: ФИО преподавателя, [Фамилия, Имя, Отчество]
                 Для audience: id группы, str

    :return: timetable - матрица с расписанием или None(если указан неправильный флаг)
    """
    timetable = empty_timetable()

    if flag == 'group':
        group = session.query(Group).filter_by(number=info).first()
        lessons = session.query(Lesson).filter_by(group_id=group.id).all()
    elif flag == 'subgroup':
        subgroup = session.query(Subgroup).filter_by(number=info).first()
        lessons = session.query(Lesson).filter_by(subgroup_id=subgroup.id).all()
    elif flag == 'teacher':
        teacher = session.query(Teacher).filter_by(second_name=info[0], first_name=info[1], middle_name=info[2]).first()
        lessons = session.query(Lesson).filter_by(teacher_id=teacher.id).all()
    elif flag == 'audience':
        audience = session.query(Audience).filter_by(number=info).first()
        lessons = session.query(Lesson).filter_by(audience_id=audience.id).all()
    else:
        return None

    for lesson in lessons:
        timetable[lesson.day][lesson.parity][lesson.number] = lesson

    return timetable


def teacher_subjects(name):
    """
    Функция получения списка предметов преподавателя
    :param name: ФИО преподавателя, [Фамилия, Имя, Отчество]
    """
    teacher = session.query(Teacher).filter_by(second_name=name[0], first_name=name[1], middle_name=name[2]).first()

    return teacher.subjects


def subject_teachers(name):
    """
    Функция получения списка преподавателей, ведущих предмет
    :param name: полное название предмета, str
    """
    subject_all = session.query(Subject).filter_by(name=name).all()

    teachers = []

    for subject in subject_all:
        teachers.append(subject.teacher)

    return teachers


# Add functions
def add_lesson(day, parity, number, type, subject_id, group_id,
               teacher_id=None, audience_id=None, subgroup_id=None):
    lesson = Lesson(day=day, parity=parity, number=number, type=type,
                    subject_id=subject_id, group_id=group_id)

    if teacher_id:
        lesson.teacher_id = teacher_id
    if audience_id:
        lesson.audience_id = audience_id
    if subgroup_id:
        lesson.subgroup_id = subgroup_id

    session.add(lesson)
    session.commit()


def add_subject(name, short_name, teacher_id):
    subject = Subject(name=name, short_name=short_name, teacher_id=teacher_id)

    session.add(subject)
    session.commit()


def add_teacher(second_name, first_name, middle_name):
    teacher = Teacher(second_name=second_name, first_name=first_name, middle_name=middle_name)

    session.add(teacher)
    session.commit()


def add_audience(number):
    audience = Audience(number=number)

    session.add(audience)
    session.commit()


def add_faculty(name, short_name):
    faculty = Faculty(name=name, short_name=short_name)

    session.add(faculty)
    session.commit()


def add_course(number, direction, faculty_id):
    course = Course(number=number, direction=direction, faculty_id=faculty_id)

    session.add(course)
    session.commit()


def add_group(number, course_id):
    group = Group(number=number, course_id=course_id)

    session.add(group)
    session.commit()


def add_subgroup(number, group_id):
    subgroup = Subgroup(number=number, group_id=group_id)

    session.add(subgroup)
    session.commit()


# Update functions
def update_lesson(day, parity, number, group_id,
                  type=None, subject_id=None, teacher_id=None, audience_id=None, subgroup_id=None):
    lesson = session.query(Lesson).filter_by(day=day, parity=parity, number=number, group_id=group_id)

    if subgroup_id:
        lesson.filter_by(subgroup_id=subgroup_id)

    if type:
        lesson.type = type
    if subject_id:
        lesson.subject_id = subject_id
    if teacher_id:
        lesson.teacher_id = teacher_id
    if audience_id:
        lesson.audience_id = audience_id

    session.commit()


def update_subject(name, short_name,
                   new_name=None, new_short_name=None):
    subject = session.query(Subject).filter_by(name=name, short_name=short_name)

    if new_name:
        subject.name = new_name
    if new_short_name:
        subject.short_name = new_short_name

    session.commit()


def update_teacher(second_name, first_name, middle_name,
                   new_second_name=None, new_first_name=None, new_middle_name=None):
    teacher = session.query(Teacher).filter_by(second_name=second_name, first_name=first_name, middle_name=middle_name)

    if new_second_name:
        teacher.second_name = new_second_name
    if new_first_name:
        teacher.first_name = new_first_name
    if new_middle_name:
        teacher.middle_name = new_middle_name

    session.commit()


# Delete functions
def delete_lesson(day, parity, number, group_id):
    lesson = session.query(Lesson).filter_by(day=day, parity=parity, number=number, group_id=group_id)

    lesson.delete()

    session.commit()


def delete_subject(name, short_name):
    subject = session.query(Subject).filter_by(name=name, short_name=short_name)

    subject.delete()

    session.commit()


def delete_teacher(second_name, first_name, middle_name):
    teacher = session.query(Teacher).filter_by(second_name=second_name, first_name=first_name, middle_name=middle_name)

    teacher.delete()

    session.commit()


def delete_audience(number):
    audience = session.query(Audience).filter_by(number=number).first()

    audience.delete()
    session.commit()


def delete_faculty(name):
    faculty = session.query(Faculty).filter_by(name=name)

    faculty.delete()
    session.commit()


def delete_course(number, direction, faculty_id):
    course = session.query(Course).filter_by(number=number, direction=direction, faculty_id=faculty_id)

    course.delete()
    session.commit()


def delete_group(number, course_id):
    group = session.query(Group).filter_by(number=number, course_id=course_id)

    group.delete()
    session.commit()


def delete_subgroup(number, group_id):
    subgroup = session.query(Subgroup).filter_by(number=number, group_id=group_id)

    subgroup.delete()
    session.commit()