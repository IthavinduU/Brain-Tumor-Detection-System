import numpy as np
from PIL import Image
import tensorflow as tf

IMG_SIZE = (150, 150)

def preprocess_image(image_file):
    image = Image.open(image_file).convert("RGB")
    image = image.resize(IMG_SIZE)
    image_array = tf.keras.preprocessing.image.img_to_array(image)
    image_array = image_array / 255.0
    return np.expand_dims(image_array, axis=0)
