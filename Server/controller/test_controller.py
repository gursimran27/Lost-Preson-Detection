from flask import Flask, request, jsonify, send_file, make_response
import os
from io import BytesIO


import pickle
from collections import Counter
from pathlib import Path

import face_recognition
from PIL import Image, ImageDraw
from sklearn.metrics import confusion_matrix
from sklearn.metrics import classification_report
import numpy as np



DEFAULT_ENCODINGS_PATH = Path("output/encodings.pkl")
BOUNDING_BOX_COLOR = "blue"
TEXT_COLOR = "white"


current_directory = os.getcwd()

def recognize_faces(
    image_location: str,
    model: str = "hog",
    encodings_location: Path = DEFAULT_ENCODINGS_PATH,
) -> bytes:
    """
    Given an unknown image, get the locations and encodings of any faces and
    compares them against the known encodings to find potential matches.
    """
    with encodings_location.open(mode="rb") as f:
        loaded_encodings = pickle.load(f)

    # training_directory = os.path.join(current_directory, image_location)

    # Check if the "training" directory exists
    if os.path.exists(image_location) and os.path.isdir(image_location):
        # List all files in the "training" directory
        files = os.listdir(image_location)

        # Filter out files that are not images
        image_files = [file for file in files if file.endswith(('.jpg', '.jpeg', '.png', '.gif'))]

        # Print the paths of the image files
        for image_file in image_files:
            image_path = os.path.join(image_location, image_file)
            # print("Path of image file:", image_path)


    input_image = face_recognition.load_image_file(image_path)

    input_face_locations = face_recognition.face_locations(
        input_image, model=model
    )
    input_face_encodings = face_recognition.face_encodings(
        input_image, input_face_locations
    )

    pillow_image = Image.fromarray(input_image)
    draw = ImageDraw.Draw(pillow_image)

    for bounding_box, unknown_encoding in zip(
        input_face_locations, input_face_encodings
    ):
        name = _recognize_face(unknown_encoding, loaded_encodings)
        if not name:
            name = "unknown"
        _display_face(draw, bounding_box, name)
    
    del draw
    # pillow_image.show()

    # Convert the image to a byte stream
    image_byte_array = BytesIO()
    pillow_image.save(image_byte_array, format='JPEG')
    image_byte_array.seek(0)

    os.remove(image_path)
    
    return image_byte_array.read()





def _display_face(draw, bounding_box, name):
    """
    Draws bounding boxes around faces, a caption area, and text captions.
    """
    top, right, bottom, left = bounding_box
    draw.rectangle(((left, top), (right, bottom)), outline=BOUNDING_BOX_COLOR)
    text_left, text_top, text_right, text_bottom = draw.textbbox(
        (left, bottom), name
    )
    draw.rectangle(
        ((text_left, text_top), (text_right, text_bottom)),
        fill=BOUNDING_BOX_COLOR,
        outline=BOUNDING_BOX_COLOR,
    )
    draw.text(
        (text_left, text_top),
        name,
        fill=TEXT_COLOR,
    )




def _recognize_face(unknown_encoding, loaded_encodings):
    """
    Given an unknown encoding and all known encodings, find the known
    encoding with the most matches.
    """
    boolean_matches = face_recognition.compare_faces(
        loaded_encodings["encodings"], unknown_encoding
    )
    votes = Counter(
        name
        for match, name in zip(boolean_matches, loaded_encodings["names"])
        if match
    )
    if votes:
        return votes.most_common(1)[0][0]








def test():
    TEST_FOLDER = 'testImage'
    
    if not os.path.exists(TEST_FOLDER):
        os.makedirs(TEST_FOLDER)

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file:
        filepath = os.path.join(TEST_FOLDER, file.filename)
        file.save(filepath)


    image_byte_array =recognize_faces(image_location='testImage')

    response = make_response(send_file(BytesIO(image_byte_array), mimetype='image/jpeg'))

    # Add JSON data to response headers
    response.headers['message'] = "Test File uploaded successfully"

    # Set status code
    response.status_code = 200
        
    return response
    
    
    

