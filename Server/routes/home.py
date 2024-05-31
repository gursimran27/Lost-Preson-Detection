from flask import Blueprint
from controller.home_controller import home

home_bp = Blueprint('home', __name__)

@home_bp.route('/')
def home_route():
    return home()