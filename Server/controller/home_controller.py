from flask import jsonify

def home():
    return jsonify({"message": "Server is up"}), 200