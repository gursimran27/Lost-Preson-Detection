from flask import Blueprint
from controller.delete_controller import delete_directory

delete_bp = Blueprint('delete_directory', __name__)

@delete_bp.route('/', methods=['get'])
def delete_route():
    return delete_directory()