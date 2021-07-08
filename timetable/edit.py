from flask import Blueprint, render_template

bp = Blueprint('edit', __name__)


@bp.route('/', methods=['GET', 'POST'])
def edit():
    return render_template('index.html', **locals())
