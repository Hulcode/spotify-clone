import { useState } from "react";

const UploadZone = ({ label, icon: Icon, onFileSelect }) => {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState(null);

  const handleFile = (file) => {
    if (!file) return;

    setFileName(file.name);
    onFileSelect(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-gray-800">{label}</span>

      <label
        className={`w-28 h-24 flex flex-col items-center justify-center gap-1.5 border-2 border-dashed rounded-lg cursor-pointer text-xs font-medium transition-all
        ${
          dragging
            ? "border-[#1DB954] bg-green-50 text-[#1DB954]"
            : "border-[#a3c9a8] bg-white text-[#7ec88a]"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files[0]);
        }}
      >
        <input
          type="file"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        <Icon size={26} />
        <span>
          {fileName
            ? fileName.length > 10
              ? fileName.slice(0, 10) + "..."
              : fileName
            : "Upload"}
        </span>
      </label>
    </div>
  );
};

export default UploadZone;
