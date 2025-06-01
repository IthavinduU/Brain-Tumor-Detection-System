import numpy as np
from PIL import Image
import io

IMG_SIZE = (128, 128)  # Match the training image size


def preprocess_image(image_bytes: bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize(IMG_SIZE)
    image_array = np.array(image) / 255.0
    return np.expand_dims(image_array, axis=0)  # Shape: (1, 128, 128, 3)
