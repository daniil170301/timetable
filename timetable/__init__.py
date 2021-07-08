from flask import Flask

from timetable.edit import bp as edit

app = Flask(__name__)

app.register_blueprint(edit)
