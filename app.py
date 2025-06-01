from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
import pickle
from PIL import Image
import io

# Load model and label encoder on startup
model = tf.keras.models.load_model(
    r"C:\Users\thavi\OneDrive\Desktop\Brain Tumor Detection System\model\brain_tumor_model.h5"
)
with open(
    r"C:\Users\thavi\OneDrive\Desktop\Brain Tumor Detection System\model\label_encoder.pkl",
    "rb",
) as f:
    label_encoder = pickle.load(f)

app = Flask(__name__)
CORS(app)  # Enable CORS for all origins

IMG_SIZE = (128, 128)  # Match the training image size


def preprocess_image(image_bytes: bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize(IMG_SIZE)
    image_array = np.array(image) / 255.0
    return np.expand_dims(image_array, axis=0)  # Shape: (1, 128, 128, 3)


@app.route("/")
def root():
    return jsonify({"message": "Brain Tumor Prediction API Running"})


@app.route("/predict", methods=["POST"])
def predict():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file part in the request"}), 400
        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400
        image_bytes = file.read()
        img = preprocess_image(image_bytes)
        preds = model.predict(img)
        pred_class_index = np.argmax(preds, axis=1)[0]
        pred_class_label = label_encoder.inverse_transform([pred_class_index])[0]
        return jsonify({"prediction": pred_class_label})
    except Exception as e:
        import traceback

        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
