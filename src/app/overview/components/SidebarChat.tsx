/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { IoChevronForward, IoDocument, IoClose, IoSearch } from 'react-icons/io5';
import { SlDocs } from "react-icons/sl";

interface Document {
  name_doc: string;
  pages: number[];
  text: string;
  score: number;
}

interface SidebarChatProps {
  documents: Document[];
  isOpen: boolean;
  onToggle: () => void;
}

export default function SidebarChat({ documents, isOpen, onToggle }: SidebarChatProps) {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const handleDocumentClick = (doc: Document) => {
    setSelectedDoc(doc);
  };

  return (
    <>
      {/* Modal flotante */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-zinc-900 rounded-xl w-[600px] h-[500px] border border-white/10 shadow-xl modal-animation">
            <div className="flex flex-col h-full">
              {/* Header fijo del modal */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-medium mb-2">{selectedDoc.name_doc}</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className={`document-badge ${
                        selectedDoc.score > 0.8 ? 'high-score' : 'medium-score'
                      }`}>
                        Score: {selectedDoc.score.toFixed(2)}
                      </span>
                      <span className="document-badge">
                        Págs: {Array.isArray(selectedDoc.pages) ? selectedDoc.pages.join(', ') : selectedDoc.pages}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedDoc(null)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <IoClose size={20} className="text-white/70 hover:text-white" />
                  </button>
                </div>
              </div>
              
              {/* Contenido scrolleable */}
              <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                <div className="text-white/80 whitespace-pre-wrap">
                  {selectedDoc.text}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resto del componente */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed right-6 top-24 z-30 bg-zinc-900/95 text-white/90 px-4 py-3 rounded-lg
                   shadow-lg backdrop-blur-sm border border-white/10 hover:border-white/20
                   transition-all duration-300 hover:scale-105 flex items-center gap-2"
        >
          <SlDocs className="text-orange-500" size={20} />
          <span className="text-sm font-medium whitespace-nowrap">
            Ver Documentos
          </span>
        </button>
      )}

      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-screen bg-zinc-950/95 backdrop-blur-md
                    border-l border-white/10 shadow-xl transition-all duration-300 
                    ease-out z-20 ${isOpen ? 'w-96 translate-x-0' : 'w-96 translate-x-full'}`}>
        {/* Header */}
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <SlDocs size={20} className="text-orange-500" />
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
        <div className="px-4 pb-4 overflow-y-auto h-[calc(100vh-8rem)]">
          <div className="space-y-3">
            {documents.map((doc, index) => (
              <div 
                key={index} 
                className="document-card group cursor-pointer hover:shadow-lg"
                onClick={() => handleDocumentClick(doc)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h3 className="font-medium mb-2 group-hover:text-white transition-colors">
                      {doc.name_doc}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className={`document-badge ${
                        doc.score > 0.8 ? 'high-score' : 'medium-score'
                      }`}>
                        Score: {doc.score.toFixed(2)}
                      </span>
                      <span className="document-badge">
                        Págs: {Array.isArray(doc.pages) ? doc.pages.join(', ') : doc.pages}
                      </span>
                    </div>
                    <p className="text-sm text-white/70 line-clamp-3 group-hover:text-white/90 
                              transition-colors">
                      {doc.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
