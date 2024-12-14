/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { getLlamaCloudKey } from '../../config/firestore';
import Sidebar from '../../components/Sidebar';
import { IoCloudUpload, IoInformationCircle, IoClose, IoArrowForward } from 'react-icons/io5';
import { FiFile } from 'react-icons/fi';
import { FaFolder } from 'react-icons/fa';
import Header from '../components/Header';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firestore';

export default function EditAgent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');

  const [formData, setFormData] = useState({
    projectName: '',
    assistantName: '',
    description: '',
    temperature: 0.7,
    instructions: '',
    parser: 'text' as 'text' | 'llama cloud',
    files: [] as File[]
  });
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [llamaKeyValid, setLlamaKeyValid] = useState(false);

  // Añadir estado para rastrear los campos originales
  const [originalData, setOriginalData] = useState({
    projectName: '',
    assistantName: '',
    description: '',
    temperature: 0.7,
    instructions: '',
    parser: 'text' as 'text' | 'llama cloud'
  });

  // Cargar datos del proyecto
  useEffect(() => {
    const fetchProjectData = async () => {
      if (!user || !projectId) {
        router.push('/overview');
        return;
      }

      try {
        const projectDoc = await getDoc(doc(db, 'projects', projectId));
        
        if (!projectDoc.exists()) {
          throw new Error('Project not found');
        }

        const projectData = projectDoc.data();
        const initialData = {
          projectName: projectData.projectName,
          assistantName: projectData.projectAssistantName,
          description: projectData.projectDescription,
          temperature: projectData.projectTemperature || 0.7,
          instructions: projectData.projectSystemPrompt || '',
          parser: projectData.projectParser || 'text'
        };

        setOriginalData(initialData);
        setFormData(prev => ({
          ...prev,
          ...initialData,
          files: [] // Los archivos siempre empiezan vacíos
        }));
      } catch (error) {
        console.error('Error fetching project data:', error);
        router.push('/overview');
      }
    };

    fetchProjectData();
  }, [user, projectId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !projectId) return;

    // Verificar si hay cambios en los campos o nuevos archivos
    const hasChanges = 
      formData.projectName !== originalData.projectName ||
      formData.assistantName !== originalData.assistantName ||
      formData.description !== originalData.description ||
      formData.temperature !== originalData.temperature ||
      formData.instructions !== originalData.instructions ||
      formData.files.length > 0;

    // Si no hay cambios, mostrar mensaje y retornar
    if (!hasChanges) {
      alert('No changes detected. Please modify some fields or upload new files to update the agent.');
      return;
    }

    setIsUploading(true);
    const formDataToSend = new FormData();
    
    // Campos obligatorios
    formDataToSend.append('userId', user.uid);
    formDataToSend.append('projectId', projectId);

    // Verificar campos modificados (excluyendo parser)
    if (formData.projectName !== originalData.projectName) {
      formDataToSend.append('projectName', formData.projectName);
    }
    if (formData.assistantName !== originalData.assistantName) {
      formDataToSend.append('projectAssistantName', formData.assistantName);
    }
    if (formData.description !== originalData.description) {
      formDataToSend.append('projectDescription', formData.description);
    }
    if (formData.temperature !== originalData.temperature) {
      formDataToSend.append('projectTemperature', formData.temperature.toString());
    }
    if (formData.instructions !== originalData.instructions) {
      formDataToSend.append('projectSystemPrompt', formData.instructions);
    }

    // Verificar si hay nuevos archivos
    if (formData.files.length > 0) {
      formData.files.forEach((file) => {
        formDataToSend.append('newFiles', file);
      });
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_API}/edit_project`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Error updating project');
      }

      router.push('/overview');
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the agent. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== indexToRemove)
    }));
  };

  const extractFilesFromDirectory = async (entry: FileSystemEntry): Promise<File[]> => {
    const files: File[] = [];
    
    if (entry.isFile) {
      const file = await new Promise<File>((resolve) => {
        (entry as FileSystemFileEntry).file(resolve);
      });
      files.push(file);
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

    for (const item of items) {
      const entry = item.webkitGetAsEntry();
      if (entry) {
        const files = await extractFilesFromDirectory(entry);
        allFiles.push(...files);
      }
    }

    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...allFiles]
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...newFiles]
    }));
    // Resetear el input para permitir seleccionar el mismo archivo nuevamente
    e.target.value = '';
  };

  const handleParserChange = async (value: string) => {
    if (value === 'llama cloud' && !llamaKeyValid) {
      alert('Por favor, configura una API key válida de Llama Cloud en la sección de Settings');
      return;
    }
    setFormData(prev => ({ ...prev, parser: value as 'text' | 'llama cloud' }));
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
                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
              >
                {file.name.includes('.') ? (
                  <FiFile className="text-emerald-400 text-xl" />
                ) : (
                  <FaFolder className="text-yellow-400 text-xl" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
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
            Actualizando el agente
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
            <h1 className="text-3xl font-semibold mb-8 font-poppins">Edit Agent</h1>

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
                    className="form-input"
                    placeholder="Enter your project name"
                    value={formData.projectName}
                    onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Assistant Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Give your assistant a name"
                    value={formData.assistantName}
                    onChange={(e) => setFormData(prev => ({ ...prev, assistantName: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    className="form-input h-24"
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
                    className="form-input h-32"
                    placeholder="Provide specific instructions for your assistant"
                    value={formData.instructions}
                    onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Upload Data</label>
                  <div
                    className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center hover:border-white/30 transition-all duration-300"
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
                className="w-full px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 transition-all duration-300 text-sm font-medium"
              >
                Update Agent
              </button>
            </form>
          </div>
        </main>
      </div>
      
      <FilePreviewModal />
      <LoadingModal />
    </div>
  );
}
