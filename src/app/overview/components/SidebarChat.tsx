import { useState } from 'react';
import { IoClose, IoSearch, IoCode, IoText, IoImage, IoDocument } from 'react-icons/io5';

interface Document {
  name_doc: string;
  text: string;
  score: number;
}

interface SidebarChatProps {
  documents: Document[];
  isOpen: boolean;
  onToggle: () => void;
}

export default function SidebarChat({ documents, isOpen, onToggle }: SidebarChatProps) {
  const getDocumentIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'py':
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
        return <IoCode className="text-blue-400" size={20} />;
      case 'txt':
      case 'md':
        return <IoText className="text-gray-400" size={20} />;
      case 'jpg':
      case 'png':
      case 'gif':
      case 'jpeg':
        return <IoImage className="text-green-400" size={20} />;
      default:
        return <IoDocument className="text-orange-400" size={20} />;
    }
  };

  return (
    <div className={`fixed right-0 top-0 h-screen bg-zinc-950/95 backdrop-blur-md
                    border-l border-white/10 shadow-xl transition-all duration-300 
                    ease-out z-20 ${isOpen ? 'w-96 translate-x-0' : 'w-96 translate-x-full'}`}>
      {/* Header */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <IoDocument size={20} className="text-orange-500" />
          <h2 className="text-lg font-medium">Documentos Relacionados</h2>
        </div>
        <button 
          onClick={onToggle}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <IoClose size={20} className="text-white/70 hover:text-white" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <IoSearch 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" 
          />
          <input
            type="text"
            placeholder="Buscar en documentos..."
            className="w-full bg-zinc-900/50 border border-white/10 rounded-lg
                     pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-white/20
                     placeholder:text-white/30"
          />
        </div>
      </div>

      {/* Documents List */}
      <div className="px-4 pb-4 overflow-y-auto h-[calc(100vh-8rem)] custom-scrollbar">
        <div className="space-y-2">
          {documents.length === 0 ? (
            <div className="text-white/50 text-center py-4">
              No hay documentos relacionados
            </div>
          ) : (
            documents.map((doc, index) => (
              <div 
                key={index} 
                className="document-item group"
              >
                <div className="flex items-center gap-3 p-3">
                  {getDocumentIcon(doc.name_doc)}
                  <span className="flex-1 truncate text-sm text-white/70 group-hover:text-white transition-colors">
                    {doc.name_doc}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
