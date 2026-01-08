// import React, { useState } from "react";
// import { FiUpload } from "react-icons/fi";

// const FileUploader = ({ onUpload }) => {
//   const [file, setFile] = useState(null);

//   const handleDrop = (e) => {
//     e.preventDefault();
//     if (e.dataTransfer.files.length > 0) {
//       setFile(e.dataTransfer.files[0]);
//       onUpload(e.dataTransfer.files[0]);
//     }
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files.length === 0) return;
//     const f = e.target.files[0];
//     setFile(f);
//     onUpload(f);
//   };

//   return (
//     <div
//       className="flex items-center gap-3 p-4 border-dashed border-2 border-gray-300 rounded-lg bg-white shadow-sm justify-center cursor-pointer hover:bg-gray-50 transition"
//       onDrop={handleDrop}
//       onDragOver={(e) => e.preventDefault()}
//     >
//       <FiUpload size={24} className="text-blue-600" />
//       <span className="text-gray-700">{file ? file.name : "Drag & drop a PDF or click to upload"}</span>
//       <input type="file" accept=".pdf,.txt" onChange={handleFileChange} className="hidden" />
//     </div>
//   );
// };

// export default FileUploader;

import React, { useState } from "react";
import { Upload, FileText, CheckCircle } from "lucide-react";

const FileUploader = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
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
    <label
      className={`relative flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
        isDragOver 
          ? "border-indigo-500 bg-indigo-50" 
          : file 
            ? "border-emerald-400 bg-emerald-50"
            : "border-slate-200 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50"
      }`}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
    >
      <input type="file" accept=".pdf,.txt" onChange={handleFileChange} className="hidden" />
      
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
          file 
            ? "bg-gradient-to-br from-emerald-500 to-teal-600" 
            : "bg-gradient-to-br from-indigo-500 to-purple-600"
        } shadow-lg ${file ? "shadow-emerald-500/25" : "shadow-indigo-500/25"}`}
      >
        {file ? (
          <CheckCircle className="w-7 h-7 text-white" />
        ) : (
          <Upload className="w-7 h-7 text-white" />
        )}
      </div>
      
      <div className="text-center">
        {file ? (
          <>
            <div className="flex items-center gap-2 text-emerald-700 font-medium">
              <FileText className="w-4 h-4" />
              {file.name}
            </div>
            <p className="text-sm text-slate-500 mt-1">File ready to process</p>
          </>
        ) : (
          <>
            <p className="text-slate-700 font-medium">
              Drop your resume here or <span className="text-indigo-600">browse</span>
            </p>
            <p className="text-sm text-slate-500 mt-1">Supports PDF and TXT files</p>
          </>
        )}
      </div>
    </label>
  );
};

export default FileUploader;