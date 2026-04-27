import React, { useState } from 'react';
import { FiX, FiUpload } from 'react-icons/fi';
import './FileUpload.css';

function FileUpload({ onClose }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  };

  const handleFileSelect = (fileList) => {
    const newFiles = [];
    for (let file of fileList) {
      if (isValidFile(file)) {
        newFiles.push(file);
      }
    }
    setFiles([...files, ...newFiles]);
  };

  const isValidFile = (file) => {
    const validTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    return validTypes.includes(file.type);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      // In a real implementation, you would upload files here
      // and get a response with file URLs or IDs
      alert(`Uploaded ${files.length} file(s) successfully!`);
      setFiles([]);
    } catch (error) {
      alert('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload">
      <div className="upload-header">
        <h2>📁 Upload Files</h2>
        <button onClick={onClose} className="close-btn">
          <FiX />
        </button>
      </div>

      <div className="upload-content">
        <div
          className="drop-zone"
          onDrop={handleFileDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="drop-icon">⬆️</div>
          <p>Drag and drop files here or click to select</p>
          <input
            type="file"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx,.txt"
            style={{ display: 'none' }}
            id="file-input"
          />
          <label htmlFor="file-input" className="select-btn">
            <FiUpload /> Browse Files
          </label>
        </div>

        {files.length > 0 && (
          <div className="files-list">
            <h3>Selected Files ({files.length})</h3>
            {files.map((file, index) => (
              <div key={index} className="file-item">
                <span className="file-name">{file.name}</span>
                <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                <button
                  onClick={() => removeFile(index)}
                  className="remove-btn"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="supported-formats">
          <h4>Supported Formats</h4>
          <ul>
            <li>📄 PDF documents</li>
            <li>🖼️ Images (JPG, PNG, GIF, WebP)</li>
            <li>📝 Documents (Word, Text)</li>
          </ul>
        </div>
      </div>

      <div className="upload-footer">
        <button
          onClick={uploadFiles}
          disabled={files.length === 0 || uploading}
          className="upload-btn"
        >
          {uploading ? 'Uploading...' : `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`}
        </button>
      </div>
    </div>
  );
}

export default FileUpload;
