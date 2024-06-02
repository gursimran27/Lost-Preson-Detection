from flask import Flask
from flask_cors import CORS

from routes.home import home_bp
from routes.upload import upload_bp
from routes.test import test_bp
from routes.delete import delete_bp


app = Flask(__name__)
CORS(app)

app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['TEST_FOLDER'] = 'testImage'

# Register blueprints
app.register_blueprint(home_bp)
app.register_blueprint(upload_bp, url_prefix='/upload')
app.register_blueprint(test_bp, url_prefix='/test')
app.register_blueprint(delete_bp, url_prefix='/delete')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
