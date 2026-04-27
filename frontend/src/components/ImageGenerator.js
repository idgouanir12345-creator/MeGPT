import React, { useState } from 'react';
import { FiX, FiDownload } from 'react-icons/fi';
import './ImageGenerator.css';

function ImageGenerator({ userId, onClose }) {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [steps, setSteps] = useState(50);

  const generateImage = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          prompt,
          negativePrompt,
          width: parseInt(width),
          height: parseInt(height),
          steps: parseInt(steps)
        })
      });

      const data = await response.json();
      if (data.error) {
        alert('Error: ' + data.error);
      } else {
        setImage(data.image);
      }
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image;
    link.download = `megpt-generated-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="image-generator">
      <div className="generator-header">
        <h2>🖼️ Image Generator</h2>
        <button onClick={onClose} className="close-btn">
          <FiX />
        </button>
      </div>

      <div className="generator-content">
        <div className="left-panel">
          <div className="form-group">
            <label>Prompt *</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              rows={6}
            />
          </div>

          <div className="form-group">
            <label>Negative Prompt (what to avoid)</label>
            <textarea
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="Describe what you don't want in the image..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Width</label>
              <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} min="256" max="768" step="64" />
            </div>
            <div className="form-group">
              <label>Height</label>
              <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} min="256" max="768" step="64" />
            </div>
          </div>

          <div className="form-group">
            <label>Steps ({steps})</label>
            <input
              type="range"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              min="10"
              max="100"
              step="5"
            />
          </div>

          <button
            className="generate-btn"
            onClick={generateImage}
            disabled={loading || !prompt.trim()}
          >
            {loading ? 'Generating...' : '✨ Generate Image'}
          </button>
        </div>

        <div className="right-panel">
          {image ? (
            <div className="image-preview">
              <img src={image} alt="Generated" />
              <button onClick={downloadImage} className="download-btn">
                <FiDownload /> Download
              </button>
            </div>
          ) : (
            <div className="no-image">
              <p>Generated image will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageGenerator;
