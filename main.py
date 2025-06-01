# main.py
from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import pickle
from PIL import Image
import io

app = Flask(__name__)

# Load model and label encoder
model = tf.keras.models.load_model("brain_tumor_model.h5")

with open("label_encoder.pkl", "rb") as f:
    label_encoder = pickle.load(f)

IMG_SIZE = (128, 128)

def preprocess_image(image_bytes: bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize(IMG_SIZE)
    image_array = np.array(image) / 255.0
    return np.expand_dims(image_array, axis=0)

@app.route("/predict", methods=["POST"])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    img_bytes = file.read()
    
    try:
        processed_img = preprocess_image(img_bytes)
        preds = model.predict(processed_img)
        predicted_index = np.argmax(preds, axis=1)[0]
        predicted_label = label_encoder.inverse_transform([predicted_index])[0]
        confidence = float(np.max(preds))
        return jsonify({"prediction": predicted_label, "confidence": confidence})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
