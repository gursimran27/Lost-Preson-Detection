from flask import request, jsonify
import os


import argparse
import pickle
from collections import Counter
from pathlib import Path

import face_recognition
from PIL import Image, ImageDraw
from sklearn.metrics import confusion_matrix
from sklearn.metrics import classification_report
import numpy as np

import seaborn as sns
import matplotlib.pyplot as plt

import re




DEFAULT_ENCODINGS_PATH = Path("output/encodings.pkl")

# Create directories if they don't already exist
Path("uploads/training").mkdir(exist_ok=True)
Path("output").mkdir(exist_ok=True)


def encode_known_faces(
    model: str = "hog"
) -> dict:
    """
    Loads images in the training directory and builds a dictionary of their
    names and encodings.
    """
    names = []
    encodings = []

    for filepath in Path("uploads/training").glob("*/*"):
        name = filepath.parent.name
        # print(name)
        image = face_recognition.load_image_file(filepath)

        face_locations = face_recognition.face_locations(image, model=model)
        face_encodings = face_recognition.face_encodings(image, face_locations)

        for encoding in face_encodings:
            names.append(name)
            encodings.append(encoding)

    return {"names": names, "encodings": encodings}






def upload_file():
    UPLOAD_FOLDER = 'uploads'
    TRAINING_FOLDER = os.path.join(UPLOAD_FOLDER, 'training')

    # Ensure the upload and training folders exist
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    if not os.path.exists(TRAINING_FOLDER):
        os.makedirs(TRAINING_FOLDER)

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    name = request.form.get('name')
    if not name:
        return jsonify({"message": "No name provided"}), 400

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        # Extract the file name without extension to create the subdirectory
        # file_name_without_ext = os.path.splitext(file.filename)[0]
        subdirectory = os.path.join(TRAINING_FOLDER, name)

        # Ensure the subdirectory exists
        if not os.path.exists(subdirectory):
            os.makedirs(subdirectory)

        # Save the file inside the subdirectory
        filepath = os.path.join(subdirectory, file.filename)
        file.save(filepath)


        encodings = encode_known_faces()
        with DEFAULT_ENCODINGS_PATH.open(mode="wb") as f:
            pickle.dump(encodings, f)


        return jsonify({"message": "File uploaded successfully and encoded successfully", "filepath": filepath}), 200


