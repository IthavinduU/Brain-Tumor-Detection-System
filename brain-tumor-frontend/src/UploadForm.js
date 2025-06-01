import React, { useState } from "react";

function UploadForm() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null); // { prediction, confidence }
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Error: ${errorData.error || "Something went wrong."}`);
      } else {
        const data = await response.json();

        // Assuming your backend returns the confidence array, e.g.
        // { prediction: "glioma", confidence: [0.99, 0.005, 0.003, 0.002] }
        // If not, we’ll just show prediction only.

        // Modify backend to send confidence? If not, just show prediction.
        setResult({
          prediction: data.prediction,
          confidence: data.confidence, // can be undefined
        });
      }
    } catch (err) {
      setError("Request failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format confidence nicely
  const renderConfidence = () => {
    if (!result?.confidence) return null;

    // Suppose confidence is an array of floats; show the max confidence %
    const maxConf = Math.max(...result.confidence);
    return (
      <p style={{ marginTop: "8px", fontWeight: "bold" }}>
        Confidence: {(maxConf * 100).toFixed(2)}%
      </p>
    );
  };

  return (
    <div
      style={{
        maxWidth: "450px",
        margin: "40px auto",
        padding: "30px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#333" }}>
        Brain Tumor Prediction
      </h2>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{
            display: "block",
            marginBottom: "15px",
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: loading ? "#888" : "#007bff",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => {
            if (!loading) e.target.style.backgroundColor = "#0056b3";
          }}
          onMouseLeave={(e) => {
            if (!loading) e.target.style.backgroundColor = "#007bff";
          }}
        >
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>

      {error && (
        <div
          style={{
            marginTop: "20px",
            color: "#b00020",
            fontWeight: "600",
            backgroundColor: "#fdd",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          {error}
        </div>
      )}

      {result && !error && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#e6ffe6",
            borderRadius: "5px",
            textAlign: "center",
            color: "#004d00",
            fontWeight: "600",
            fontSize: "18px",
          }}
        >
          <p>Prediction: {result.prediction}</p>
          {renderConfidence()}
        </div>
      )}
    </div>
  );
}

export default UploadForm;
