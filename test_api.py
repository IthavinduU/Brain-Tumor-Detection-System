from PIL import Image
import numpy as np
import tensorflow as tf

# Load model
model = tf.keras.models.load_model("model/brain_tumor_model.h5")

# Load and preprocess an image from disk (use 128x128 size)
img = (
    Image.open(
        r"C:\Users\thavi\OneDrive\Desktop\Brain Tumor Detection System\archive\Testing\glioma\Te-gl_0010.jpg"
    )
    .convert("RGB")
    .resize((128, 128))
)
img_array = np.array(img) / 255.0
img_array = np.expand_dims(img_array, axis=0)  # Shape (1,128,128,3)

print("Input shape:", img_array.shape)

preds = model.predict(img_array)
print("Predictions:", preds)
