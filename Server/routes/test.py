from flask import Blueprint, request, jsonify
from controller.test_controller import test

test_bp = Blueprint('test', __name__)

@test_bp.route('/', methods=['POST'])
def test_route():
    return test()