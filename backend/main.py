from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from utils import preprocess_image
import numpy as np
import tensorflow as tf
import pickle
from keras.models import Sequential
from keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from keras.optimizers import Adam
from keras.callbacks import EarlyStopping

# Load model and label encoder
model = tf.keras.models.load_model("model/brain_tumor_model.h5")

with open("model/label_encoder.pkl", "rb") as f:
    label_encoder = pickle.load(f)

app = FastAPI()

# Allow CORS (for frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Brain tumor prediction API"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_data = await file.read()
    processed_image = preprocess_image(image_data)

    # Predict
    prediction = model.predict(processed_image)
    predicted_class = np.argmax(prediction)
    class_name = label_encoder.inverse_transform([predicted_class])[0]
    confidence = float(np.max(prediction)) * 100

    return {
        "prediction": class_name,
        "confidence": f"{confidence:.2f}%"
    }
