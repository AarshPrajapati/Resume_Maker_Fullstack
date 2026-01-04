import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";

const FileUploader = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length === 0) return;
    const f = e.target.files[0];
    setFile(f);
    onUpload(f);
  };

  return (
    <div
      className="flex items-center gap-3 p-4 border-dashed border-2 border-gray-300 rounded-lg bg-white shadow-sm justify-center cursor-pointer hover:bg-gray-50 transition"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <FiUpload size={24} className="text-blue-600" />
      <span className="text-gray-700">{file ? file.name : "Drag & drop a PDF or click to upload"}</span>
      <input type="file" accept=".pdf,.txt" onChange={handleFileChange} className="hidden" />
    </div>
  );
};

export default FileUploader;
