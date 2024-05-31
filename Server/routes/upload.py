from flask import Blueprint, request, jsonify
from controller.uploadController import upload_file

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/', methods=['POST'])
def upload_route():
    return upload_file()
