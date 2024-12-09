'use client'

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import AgentCard from '../components/AgentCard';
import { useRouter } from 'next/navigation';
import { IoAdd, IoClose, IoSearch, IoDocument, IoTrash, IoPencil, IoChatbubbles } from 'react-icons/io5';
import Header from './components/Header';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firestore';
import { getGlobalProjects } from '../config/firestore';
import FileRenderer from './components/FileRenderer';

interface Project {
  projectName: string;
  projectId: string;
  projectCreatedAt: string;
  projectStatus: 'active' | 'building' | 'inactive';
  projectLoading: number;
  projectMessage: string;
  projectAssistantName: string;
  projectDescription: string;
  projectFileNames: string[];
  isGlobal?: boolean;
}

export default function Overview() {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [fileSearchTerm, setFileSearchTerm] = useState('');
  const [isDeletingProject, setIsDeletingProject] = useState(false);

  useEffect(() => {
    const fetchAllProjects = async () => {
      setLoading(true);
      try {
        // Obtener proyectos globales
        const globalProjects = await getGlobalProjects();
        
        // Obtener proyectos del usuario si está autenticado
        let userProjects: Project[] = [];
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userProjectIds = userDoc.data()?.userProjects || [];

          const projectPromises = userProjectIds.map(async (projectId: string) => {
            const projectDoc = await getDoc(doc(db, 'projects', projectId));
            if (projectDoc.exists()) {
              return {
                projectId,
                ...projectDoc.data(),
                isGlobal: false
              } as Project;
            }
            return null;
          });

          userProjects = (await Promise.all(projectPromises)).filter((p): p is Project => p !== null);
        }

        // Combinar proyectos globales y del usuario
        setProjects([...globalProjects, ...userProjects]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    };

    fetchAllProjects();
  }, [user]);

  const filteredProjects = projects.filter(project =>
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setFileSearchTerm('');
  };

  const filteredFiles = selectedProject?.projectFileNames.filter(fileName =>
    fileName.toLowerCase().includes(fileSearchTerm.toLowerCase())
  ) || [];

  const DeletingModal = () => {
    if (!isDeletingProject) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-[#1a1a1a] rounded-lg p-8 max-w-md w-full mx-4 text-center border border-white/10">
          <h3 className="text-xl font-medium mb-2 flex items-center justify-center gap-2">
            Eliminando agente
            <span className="loading-dots"></span>
          </h3>
          <p className="text-gray-400">
            Esto tomará solo un momento
          </p>
        </div>
      </div>
    );
  };

  const handleDeleteProject = async () => {
    if (!selectedProject || !user) return;

    setIsDeletingProject(true);
    try {
      const formData = new FormData();
      formData.append('projectId', selectedProject.projectId);
      formData.append('userId', user.uid);

      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_API}/delete`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error deleting project');
      }

      // Refetch projects instead of refresh
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userProjects = userDoc.data()?.userProjects || [];

      const projectPromises = userProjects.map(async (projectId: string) => {
        const projectDoc = await getDoc(doc(db, 'projects', projectId));
        if (projectDoc.exists()) {
          return {
            projectId,
            ...projectDoc.data()
          } as Project;
        }
        return null;
      });

      const projectsData = (await Promise.all(projectPromises)).filter((p): p is Project => p !== null);
      setProjects(projectsData);

    } catch (error) {
      console.error('Error:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsDeletingProject(false);
      setSelectedProject(null);
    }
  };

  const renderModalButtons = (project: Project) => {
    if (project.isGlobal) {
      return (
        <button 
          onClick={() => router.push(`/overview/chat?projectId=${project.projectId}`)}
          className="px-4 py-2 rounded-lg bg-white text-black 
          hover:bg-white/90 transition-all duration-300 text-sm flex items-center gap-2"
        >
          <IoChatbubbles />
          Chat
        </button>
      );
    }

    return (
      <>
        <button 
          onClick={handleDeleteProject}
          className="px-4 py-2 rounded-lg border border-red-500/50 text-red-500 
          hover:bg-red-500/10 transition-all duration-300 text-sm flex items-center gap-2"
        >
          <IoTrash />
          Delete
        </button>
        <button 
          onClick={() => router.push(`/overview/edit?projectId=${selectedProject?.projectId}`)}
          className="px-4 py-2 rounded-lg border border-white/10 text-white 
          hover:bg-white/10 transition-all duration-300 text-sm flex items-center gap-2"
        >
          <IoPencil />
          Edit
        </button>
        <button 
          onClick={() => router.push(`/overview/chat?projectId=${selectedProject?.projectId}`)}
          className="px-4 py-2 rounded-lg bg-white text-black 
          hover:bg-white/90 transition-all duration-300 text-sm flex items-center gap-2"
        >
          <IoChatbubbles />
          Chat
        </button>
      </>
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
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-semibold mb-8 font-poppins">Agents</h1>
            
            <div className="mb-6 flex gap-4 items-center">
              <input
                type="text"
                placeholder="Search agents..."
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 transition-all duration-300 hover:border-white/30 focus:border-white/30 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                onClick={() => router.push('/overview/create')}
                className="px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 transition-all duration-300 text-sm font-medium flex items-center gap-2 whitespace-nowrap"
              >
                <IoAdd className="text-lg" />
                Create
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-white/70">Loading...</div>
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <AgentCard
                    key={project.projectId}
                    name={project.projectName}
                    projectId={project.projectId}
                    created={project.projectCreatedAt}
                    status={project.projectStatus}
                    message={project.projectMessage}
                    progress={project.projectLoading}
                    onClick={() => handleProjectClick(project)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-white/70">
                <p className="text-xl mb-2">Sin proyectos</p>
                <p className="text-sm">Crea tu primer agente para comenzar. Los proyectos nuevos pueden tardar un par de minutos en mostrarse.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal de detalles del proyecto */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-lg max-w-2xl w-full max-h-[80vh] border border-white/10">
            {/* Header del modal */}
            <div className="p-6 border-b border-white/10 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-1">{selectedProject.projectName}</h2>
                <p className="text-white/50 text-sm font-mono">{selectedProject.projectId}</p>
              </div>
              <button 
                onClick={() => setSelectedProject(null)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <IoClose className="text-xl" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-6">
              {/* Detalles básicos */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-white/50 text-sm mb-1">Assistant Name</h3>
                  <p className="text-white">{selectedProject.projectAssistantName}</p>
                </div>
                <div>
                  <h3 className="text-white/50 text-sm mb-1">Description</h3>
                  <p className="text-white">{selectedProject.projectDescription}</p>
                </div>
                <div>
                  <h3 className="text-white/50 text-sm mb-1">Status</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs inline-block ${
                    selectedProject.projectStatus === 'active' ? 'bg-emerald-500/20 text-emerald-500' :
                    selectedProject.projectStatus === 'building' ? 'bg-blue-500/20 text-blue-500' :
                    'bg-red-500/20 text-red-500'
                  }`}>
                    {selectedProject.projectStatus}
                  </span>
                </div>
              </div>

              {/* Lista de archivos */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-white/50 text-sm">Files</h3>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                    {selectedProject.projectFileNames.length}
                  </span>
                </div>
                
                {/* Buscador de archivos */}
                <div className="relative mb-4">
                  <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={fileSearchTerm}
                    onChange={(e) => setFileSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                    focus:border-white/30 transition-colors"
                  />
                </div>

                {/* Lista de archivos con scroll */}
                <div className="max-h-48 overflow-y-auto modal-scroll space-y-2">
                  {filteredFiles.map((fileName, index) => (
                    <FileRenderer 
                      key={index}
                      fileName={fileName}
                      showSize={false}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Footer con botones */}
            <div className="p-6 border-t border-white/10 flex justify-end gap-3">
              {selectedProject && renderModalButtons(selectedProject)}
            </div>
          </div>
        </div>
      )}
      <DeletingModal />
    </div>
  );
}
