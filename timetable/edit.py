from flask import Blueprint, render_template, jsonify, request

bp = Blueprint('edit', __name__)


@bp.route('/edit', methods=['GET'])
def edit():
    return render_template('edit.html', **locals())


@bp.route('/edit/get/<string:faculty>/<string:direction>/<string:course>/', methods=['POST'])
def get(faculty, direction, course):
    return jsonify(success='yes', faculty=faculty, direction=direction, course=course)


@bp.route('/edit/save/', methods=['POST'])
def save():
    print(request)
    return jsonify(success='yes')
