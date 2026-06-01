import { Upload } from "lucide-react";
import { useRef } from "react";

interface UploadAreaProps {
  onUpload: (file: File) => void;
  disabled?: boolean;
}

export default function UploadArea({ onUpload, disabled }: UploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && isValidImage(file)) {
      onUpload(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file && isValidImage(file)) {
      onUpload(file);
    }
  };

  const isValidImage = (file: File) => {
    return file.type.startsWith("image/");
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
      className={`border-4 border-dashed border-gray-500 rounded-2xl p-12 text-center cursor-pointer transition-all
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-red-500 hover:bg-red-900 hover:bg-opacity-10"}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
      />
      <Upload size={64} className="mx-auto text-gray-400 mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">
        Upload Squad Screenshot
      </h2>
      <p className="text-gray-400 mb-4">
        Drag and drop your eFootball squad image here
      </p>
      <button
        className="px-8 py-3 bg-linear-to-r from-red-600 to-orange-600 text-white font-bold rounded-lg hover:from-red-700 hover:to-orange-700 transition disabled:opacity-50"
        disabled={disabled}
      >
        {disabled ? "Analyzing..." : "Choose Image"}
      </button>
    </div>
  );
}
