# Brain Tumor Detection System

A full-stack web application that detects brain tumors from MRI images using a Convolutional Neural Network (CNN). This project combines a Flask backend for model inference and a React frontend for user interaction, containerized with Docker.

## Features

- Upload MRI image and receive tumor prediction.
- Displays confidence levels per class.
- Drag and drop image upload with preview.
- Error handling for invalid/non-MRI images.
- Fully responsive and styled frontend.
- Scalable architecture using Docker.

---

## Tech Stack

**Frontend:**
- React
- Axios
- Styled Components / CSS Modules

**Backend:**
- Python
- Flask
- TensorFlow/Keras
- Pillow
- NumPy
- Flask-CORS

**DevOps:**
- Docker
- Docker Compose

---

## Model Information

- Trained a CNN model to classify brain MRIs into 4 categories:
  - **Glioma Tumor**
  - **Meningioma Tumor**
  - **Pituitary Tumor**
  - **No Tumor**
- Preprocessing: Images resized to 128x128 or 150x150, normalized to `[0,1]` range.
- Model saved in HDF5 format (`brain_tumor_model.h5`).
- Label encoding stored using `pickle`.

---

## Project Structure

Brain-Tumor-Detection-System/
│
├── backend/
│ ├── app.py
│ ├── utils.py
│ ├── test_api.py
│ ├── model/
│ │ ├── brain_tumor_model.h5
│ │ └── label_encoder.pkl
│ └── requirements.txt
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── App.js
│ │ └── App.css
│ └── package.json
│
├── docker-compose.yml
├── README.md



---

## Installation

### 1. Clone the Repository

git clone https://github.com/IthavinduU/Brain-Tumor-Detection-System.git
cd Brain-Tumor-Detection-System


### 2. Backend Setup

cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
python app.py

### 3. Frontend Setup

cd ../frontend
npm install
npm start

### 4. Run with Docker (Recommended)

docker-compose up --build

---

