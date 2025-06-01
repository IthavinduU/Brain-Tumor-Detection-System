import React, { useState } from "react";

function UploadForm() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select an image file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setResult("");

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setResult(`Error: ${errorData.error}`);
      } else {
        const data = await response.json();
        setResult(`Prediction: ${data.prediction}`);
      }
    } catch (error) {
      setResult("Request failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Brain Tumor Prediction</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <br />
        <button type="submit" style={{ marginTop: "10px" }}>
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>
      {result && <p style={{ marginTop: "20px" }}>{result}</p>}
    </div>
  );
}

export default UploadForm;
