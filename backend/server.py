from flask import Flask, request, jsonify
from google.cloud import vision
import io

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload():
    if 'image' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    image_file = request.files['image']
    image_bytes = image_file.read()

    client = vision.ImageAnnotatorClient()
    image = vision.Image(content=image_bytes)
    response = client.text_detection(image=image)
    
    texts = response.text_annotations
    extracted_text = texts[0].description if texts else "No text found"

    return jsonify({"text": extracted_text})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
