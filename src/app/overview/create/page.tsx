'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { getLlamaCloudKey } from '../../config/firestore';
import Sidebar from '../../components/Sidebar';
import { IoCloudUpload, IoInformationCircle, IoClose, IoArrowForward } from 'react-icons/io5';
import Header from '../components/Header';
import { LuDatabaseZap } from 'react-icons/lu';
import { PiGraph } from 'react-icons/pi';
import FileRenderer from '../components/FileRenderer';

export default function CreateAgent() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    projectName: '',
    assistantName: '',
    description: '',
    temperature: 0.7,
    instructions: '',
    files: [] as File[]
  });
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<'basic' | 'lightrag'>('basic');
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [infoModalContent, setInfoModalContent] = useState('');
  const [fileTypeError, setFileTypeError] = useState<string | null>(null);

  useEffect(() => {
    const checkLlamaKey = async () => {
      if (user) {
        await getLlamaCloudKey(user.uid);
      }
    };
    checkLlamaKey();
  }, [user]);

  const extractFilesFromDirectory = async (entry: FileSystemEntry): Promise<File[]> => {
    const files: File[] = [];
    
    if (entry.isFile) {
      const file = await new Promise<File>((resolve) => {
        (entry as FileSystemFileEntry).file(resolve);
      });
      if (isFileTypeAllowed(file.name)) {
        files.push(file);
      }
    } else if (entry.isDirectory) {
      const dirReader = (entry as FileSystemDirectoryEntry).createReader();
      const entries = await new Promise<FileSystemEntry[]>((resolve) => {
        dirReader.readEntries(resolve);
      });
      
      for (const entry of entries) {
        const subFiles = await extractFilesFromDirectory(entry);
        files.push(...subFiles);
      }
    }
    
    return files;
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const items = Array.from(e.dataTransfer.items);
    const allFiles: File[] = [];
    const disallowedFiles: string[] = [];

    for (const item of items) {
      const entry = item.webkitGetAsEntry();
      if (entry) {
        const files = await extractFilesFromDirectory(entry);
        allFiles.push(...files);
        
        if (entry.isFile) {
          const file = await new Promise<File>((resolve) => {
            (entry as FileSystemFileEntry).file(resolve);
          });
          if (!isFileTypeAllowed(file.name)) {
            disallowedFiles.push(file.name);
          }
        }
      }
    }

    if (disallowedFiles.length > 0) {
      setFileTypeError("Only the following file types are allowed: docx, pptx, md, txt, pdf.");
    }

    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...allFiles]
    }));
  };

  const isFileTypeAllowed = (fileName: string) => {
    const allowedExtensions = ['docx', 'pptx', 'md', 'txt', 'pdf'];
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    return allowedExtensions.includes(fileExtension || '');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const allowedFiles = newFiles.filter(file => isFileTypeAllowed(file.name));
    const disallowedFiles = newFiles.filter(file => !isFileTypeAllowed(file.name));

    if (disallowedFiles.length > 0) {
      setFileTypeError("Only the following file types are allowed: docx, pptx, md, txt, pdf.");
    }

    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...allowedFiles]
    }));

    e.target.value = '';
  };

  const removeFile = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== indexToRemove)
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.projectName.trim()) {
      setError("Project name is required");
      return false;
    }
    if (!formData.assistantName.trim()) {
      setError("Assistant name is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return false;
    }
    if (!formData.instructions.trim()) {
      setError("Instructions are required");
      return false;
    }
    if (formData.files.length === 0) {
      setError("At least one file is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!validateForm()) {
      return;
    }

    setIsUploading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('userId', user.uid);
    formDataToSend.append('projectName', formData.projectName);
    formDataToSend.append('projectAssistantName', formData.assistantName);
    formDataToSend.append('projectDescription', formData.description);
    formDataToSend.append('projectTemperature', formData.temperature.toString());
    formDataToSend.append('projectSystemPrompt', formData.instructions);
    formDataToSend.append('typeModel', selectedModel);

    formData.files.forEach((file) => {
      formDataToSend.append('files', file);
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_API}/create`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Error uploading files');
      }

      // Manejar respuesta exitosa
      router.push('/overview');
    } catch (error) {
      console.error('Error:', error);
      // Manejar error
    }
  };

  const handleModelSelect = (model: 'basic' | 'lightrag') => {
    setSelectedModel(model);
  };

  const FilePreviewModal = () => {
    if (!showPreview) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#1a1a1a] rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Uploaded Files</h3>
            <button 
              onClick={() => setShowPreview(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <IoClose size={24} />
            </button>
          </div>
          
          <div className="space-y-2">
            {formData.files.map((file, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <FileRenderer 
                  fileName={file.name}
                  size={file.size}
                />
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <IoClose size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const LoadingModal = () => {
    if (!isUploading) return null;

    return (
      <div className="loading-modal">
        <div className="loading-content">
          <h3 className="loading-title">
            Construyendo el agente
            <span className="loading-dots"></span>
          </h3>
          <p className="loading-message">
            Esto puede tomar unos minutos mientras procesamos tus archivos
          </p>
          <button
            onClick={() => router.push('/overview')}
            className="view-status-button"
          >
            Ver estado
            <IoArrowForward />
          </button>
        </div>
      </div>
    );
  };

  const ErrorModal = () => {
    if (!error) return null;

    return (
      <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={() => setError(null)}
      >
        <div 
          className="bg-[#1a1a1a] rounded-lg p-6 max-w-md w-full mx-4"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-red-400">Error</h3>
            <button 
              onClick={() => setError(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <IoClose size={24} />
            </button>
          </div>
          <p className="text-gray-300">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-4 w-full px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  const showInfoModal = (content: string) => {
    setInfoModalContent(content);
    setInfoModalVisible(true);
  };

  const InfoModal = () => {
    if (!infoModalVisible) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#1a1a1a] rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-white">Model Information</h3>
            <button 
              onClick={() => setInfoModalVisible(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <IoClose size={24} />
            </button>
          </div>
          <p className="text-gray-300">{infoModalContent}</p>
          <button
            onClick={() => setInfoModalVisible(false)}
            className="mt-4 w-full px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  const FileTypeErrorModal = () => {
    if (!fileTypeError) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#1a1a1a] rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <IoInformationCircle className="text-xl text-red-400" />
              <h3 className="text-lg font-medium text-white">File Type Error</h3>
            </div>
            <button 
              onClick={() => setFileTypeError(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <IoClose size={24} />
            </button>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
            <p className="text-gray-300">{fileTypeError}</p>
            <ul className="mt-2 space-y-1 text-gray-400 text-sm">
              <li>• Word Documents (.docx)</li>
              <li>• PowerPoint Presentations (.pptx)</li>
              <li>• Markdown Files (.md)</li>
              <li>• Text Files (.txt)</li>
              <li>• PDF Documents (.pdf)</li>
            </ul>
          </div>
          <button
            onClick={() => setFileTypeError(null)}
            className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium"
          >
            Got it
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen font-geist">
      <div className="fixed left-0 top-0">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64">
        <div className="fixed top-0 right-0 left-64 z-10">
          <Header />
        </div>
        <main className="p-8 mt-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-semibold mb-8 font-poppins">Create your assistant</h1>

            {/* Info Card */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-8">
              <div className="flex items-center gap-2 mb-2">
                <IoInformationCircle className="text-xl text-gray-300" />
                <h2 className="text-base font-medium">Important Information</h2>
              </div>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>• Supported file formats: .txt, .pdf</li>
                <li>• Maximum of 1000 pages per file</li>
                <li>• You can upload multiple files or entire folders</li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Project Name</label>
                  <input
                    type="text"
                    className="form-input h-12"
                    placeholder="Enter your project name"
                    value={formData.projectName}
                    onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Assistant Name</label>
                  <input
                    type="text"
                    className="form-input h-12"
                    placeholder="Give your assistant a name"
                    value={formData.assistantName}
                    onChange={(e) => setFormData(prev => ({ ...prev, assistantName: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    className="form-input h-32"
                    placeholder="Describe what your assistant will do"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Temperature: {formData.temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    className="w-full"
                    value={formData.temperature}
                    onChange={(e) => setFormData(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>More Focused</span>
                    <span>More Creative</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Instructions</label>
                  <textarea
                    className="form-input h-40"
                    placeholder="Provide specific instructions for your assistant"
                    value={formData.instructions}
                    onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Model</label>
                  <div className="grid grid-cols-2 gap-6 mb-8 max-w-md">
                    <div
                      className={`model-container ${selectedModel === 'basic' ? 'selected' : ''}`}
                      onClick={() => handleModelSelect('basic')}
                    >
                      <h3 className="text-center">Traditional</h3>
                      <LuDatabaseZap className="mx-auto text-4xl mb-2" />
                      <button 
                        className="info-button absolute top-2 right-2" 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          showInfoModal("The traditional model. Good for most tasks, low cost, specifically designed for concise answers.");
                        }}
                      >
                        <IoInformationCircle size={20} />
                      </button>
                      <p className="text-center text-sm mt-2">$0.02 per 1k pages</p>
                    </div>

                    <div
                      className={`model-container ${selectedModel === 'lightrag' ? 'selected' : ''} coming-soon-model`}
                    >
                      <div className="coming-soon-badge">Soon</div>
                      <h3 className="text-center opacity-50">Advanced</h3>
                      <PiGraph className="mx-auto text-4xl mb-2 opacity-50" />
                      <button 
                        className="info-button absolute top-2 right-2" 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          showInfoModal("The most advanced model. More accurate and complete responses, designed for concise answers and general contexts.");
                        }}
                      >
                        <IoInformationCircle size={20} />
                      </button>
                      <p className="text-center text-sm mt-2 opacity-50">$0.2 per 1k pages</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Upload Data</label>
                  <div
                    className="border-2 border-dashed border-white/10 rounded-lg p-12 text-center hover:border-white/30 transition-all duration-300"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    <IoCloudUpload className="mx-auto text-4xl mb-4" />
                    <p className="text-sm text-gray-300">
                      Drag and drop files or folders here, or{' '}
                      <label className="text-white cursor-pointer hover:underline">
                        browse
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                      </label>
                    </p>
                    {formData.files.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <div className="text-sm text-gray-300">
                          {formData.files.length} file{formData.files.length !== 1 ? 's' : ''} selected
                        </div>
                        <div className="flex gap-2 justify-center">
                          <button
                            type="button"
                            onClick={() => setShowPreview(true)}
                            className="text-sm text-white/70 hover:text-white transition-colors underline"
                          >
                            Preview files
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, files: [] }))}
                            className="text-sm text-red-400/70 hover:text-red-400 transition-colors underline"
                          >
                            Clear all
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 rounded-lg bg-white/50 text-black/50 transition-all duration-300 
                text-sm font-medium cursor-not-allowed hover:bg-white/40"
                disabled={true}
                title="Feature coming soon! We're working hard to bring you the best experience :)"
              >
                Create Assistant
              </button>
            </form>
          </div>
        </main>
      </div>
      
      <FilePreviewModal />
      <LoadingModal />
      <ErrorModal />
      <InfoModal />
      <FileTypeErrorModal />
    </div>
  );
}