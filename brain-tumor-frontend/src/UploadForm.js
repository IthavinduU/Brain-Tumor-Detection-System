import React, { useState, useRef } from "react";
import styled, { keyframes } from "styled-components";

// --- Styled components and theme ---
const theme = {
    colors: {
        primary: "#0d6efd",
        primaryDark: "#084298",
        background: "#f5f7fa",
        cardBackground: "#ffffff",
        error: "#dc3545",
        success: "#198754",
        textDark: "#212529",
        textLight: "#f8f9fa",
    },
    fonts: {
        base: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    borderRadius: "8px",
    spacing: "16px",
};

const Container = styled.div`
  max-width: 480px;
  margin: 40px auto;
  padding: ${theme.spacing};
  border-radius: ${theme.borderRadius};
  background-color: ${theme.colors.cardBackground};
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  font-family: ${theme.fonts.base};
`;

const Title = styled.h2`
  text-align: center;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing};
  font-weight: 700;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing};
`;

const FileInput = styled.input`
  display: none;
`;

const DragDropArea = styled.div`
  padding: 24px;
  border: 2px dashed
    ${(props) =>
        props.isDragActive ? theme.colors.primary : theme.colors.primaryDark};
  border-radius: ${theme.borderRadius};
  text-align: center;
  cursor: pointer;
  color: ${(props) =>
        props.isDragActive ? theme.colors.primary : theme.colors.primaryDark};
  background-color: ${(props) =>
        props.isDragActive ? theme.colors.background : "transparent"};
  transition: all 0.3s ease;
  user-select: none;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 250px;
  margin-top: ${theme.spacing};
  border-radius: ${theme.borderRadius};
  object-fit: contain;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
`;

const Button = styled.button`
  padding: 14px;
  border-radius: ${theme.borderRadius};
  border: none;
  background-color: ${(props) =>
        props.disabled ? "#6c757d" : theme.colors.primary};
  color: ${theme.colors.textLight};
  font-weight: 700;
  font-size: 18px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) =>
        props.disabled ? "#6c757d" : theme.colors.primaryDark};
  }
`;

const MessageBox = styled.div`
  margin-top: ${theme.spacing};
  padding: 12px;
  border-radius: ${theme.borderRadius};
  font-weight: 600;
  text-align: center;
  color: ${(props) => props.color || theme.colors.textDark};
  background-color: ${(props) => props.bgColor || "transparent"};
  box-shadow: ${(props) =>
        props.shadow ? "0 3px 10px rgba(0,0,0,0.1)" : "none"};
`;

const ConfidenceList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: ${theme.spacing};
`;

const ConfidenceItem = styled.li`
  background-color: ${(props) =>
        props.isTop ? theme.colors.primary : theme.colors.background};
  color: ${(props) => (props.isTop ? theme.colors.textLight : theme.colors.textDark)};
  padding: 6px 12px;
  border-radius: ${theme.borderRadius};
  margin-bottom: 6px;
  font-weight: ${(props) => (props.isTop ? "700" : "400")};
  box-shadow: ${(props) =>
        props.isTop ? "0 2px 8px rgba(13,110,253,0.4)" : "none"};
  transition: all 0.3s ease;
`;

// Spinner keyframes and component
const spin = keyframes`
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #ccc;
  border-top: 4px solid ${theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 20px auto 0;
`;

// --- Component ---

const UploadForm = () => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [result, setResult] = useState(null); // { prediction, confidence }
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isDragActive, setIsDragActive] = useState(false);

    const inputRef = useRef();

    // Hardcoded classes for confidence display (must match backend order)
    const classes = ["glioma", "meningioma", "pituitary", "no tumor"];

    const resetState = () => {
        setError("");
        setResult(null);
    };

    const handleFileChange = (e) => {
        resetState();
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        resetState();
        setIsDragActive(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type.startsWith("image/")) {
            setFile(droppedFile);
            setPreviewUrl(URL.createObjectURL(droppedFile));
        } else {
            setError("Please drop a valid image file.");
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragActive(false);
    };

    const handleClickDragArea = () => {
        inputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setError("Please select or drop an image file first.");
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
                setResult({
                    prediction: data.prediction,
                    confidence: data.confidence,
                });
            }
        } catch (err) {
            setError("Request failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderConfidenceDetails = () => {
        if (!result?.confidence) return null;

        const maxConfidence = Math.max(...result.confidence);

        return (
            <ConfidenceList>
                {result.confidence.map((conf, idx) => (
                    <ConfidenceItem key={idx} isTop={conf === maxConfidence}>
                        {classes[idx]}: {(conf * 100).toFixed(2)}%
                    </ConfidenceItem>
                ))}
            </ConfidenceList>
        );
    };

    return (
        <Container>
            <Title>Brain Tumor Prediction</Title>

            <Form
                onSubmit={handleSubmit}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <FileInput
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={inputRef}
                    id="file-upload"
                />

                <DragDropArea
                    htmlFor="file-upload"
                    isDragActive={isDragActive}
                    onClick={handleClickDragArea}
                    tabIndex={0}
                    onKeyPress={(e) => e.key === "Enter" && handleClickDragArea()}
                    role="button"
                    aria-label="File Upload Dropzone"
                >
                    {file ? (
                        <span>{file.name}</span>
                    ) : (
                        "Drag & drop an image here, or click to select a file"
                    )}
                </DragDropArea>

                {previewUrl && <PreviewImage src={previewUrl} alt="Image preview" />}

                <Button type="submit" disabled={loading}>
                    {loading ? "Predicting..." : "Predict"}
                </Button>
            </Form>

            {loading && <Spinner />}

            {error && (
                <MessageBox bgColor={theme.colors.error} color={theme.colors.textLight}>
                    {error}
                </MessageBox>
            )}

            {result && !error && (
                <MessageBox
                    bgColor={theme.colors.success}
                    color={theme.colors.textLight}
                    shadow
                >
                    <p style={{ fontSize: 20, margin: 0 }}>
                        <strong>Prediction:</strong> {result.prediction}
                    </p>
                    {renderConfidenceDetails()}
                </MessageBox>
            )}
        </Container>
    );
};

export default UploadForm;
