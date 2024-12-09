import React from 'react';
import { FaRegFilePdf } from "react-icons/fa";
import { GrDocumentTxt } from "react-icons/gr";
import { BsFiletypeMd, BsFiletypePptx, BsFiletypeDocx } from "react-icons/bs";
import { FiFile } from "react-icons/fi";

interface FileRendererProps {
  fileName: string;
  size?: number;
  showSize?: boolean;
  className?: string;
}

export const getFileIcon = (fileName: string) => {
  const fileExtension = fileName.split('.').pop()?.toLowerCase();
  switch (fileExtension) {
    case 'pdf':
      return <FaRegFilePdf className="text-red-500" />;
    case 'txt':
      return <GrDocumentTxt className="text-white" />;
    case 'md':
      return <BsFiletypeMd className="text-gray-500" />;
    case 'pptx':
      return <BsFiletypePptx className="text-orange-500" />;
    case 'docx':
      return <BsFiletypeDocx className="text-blue-500" />;
    default:
      return <FiFile className="text-emerald-400" />;
  }
};

export default function FileRenderer({ fileName, size, showSize = true, className = "text-xl" }: FileRendererProps) {
  const IconComponent = () => {
    const icon = getFileIcon(fileName);
    return React.cloneElement(icon, { className: `${icon.props.className} ${className}` });
  };

  return (
    <div className="flex items-center gap-3">
      <IconComponent />
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate">{fileName}</p>
        {showSize && size && (
          <p className="text-xs text-gray-400">
            {(size / 1024 / 1024).toFixed(2)} MB
          </p>
        )}
      </div>
    </div>
  );
}
