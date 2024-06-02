from flask import jsonify
import shutil
import os


def delete_directory():
    directory_path_1= "C:/Users/Dell/OneDrive/Desktop/python/Lost-person-detection/Server/uploads/training"
    directory_path_2= "C:/Users/Dell/OneDrive/Desktop/python/Lost-person-detection/Server/output"

    try:
        if os.path.exists(directory_path_1):
            if os.path.exists(directory_path_2):
                shutil.rmtree(directory_path_1)
                shutil.rmtree(directory_path_2)
                return jsonify({'message': "Directory successfully deleted"}), 200
            else:
                return jsonify({'message': "Output directory-2 does not exist"}), 404
        else:
            return jsonify({'message': "Output directory-1 does not exist"}), 404
    
    except OSError as e:
        return jsonify({'error': f"Error: {e.strerror}"}), 500

