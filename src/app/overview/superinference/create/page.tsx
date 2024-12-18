'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import { IoClose, IoArrowForward, IoSearch } from 'react-icons/io5';
import Header from '../../components/Header';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../config/firestore';

interface Project {
  projectId: string;
  projectName: string;
}

export default function CreateSuperInference() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    jobName: '',
    jobDescription: '',
    jobInstructions: '',
    jobProjectId: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState<'name' | 'id'>('name');

  useEffect(() => {
    const fetchUserProjects = async () => {
      if (!user) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userProjectIds = userDoc.data()?.userProjects || [];
        
        const projectPromises = userProjectIds.map(async (projectId: string) => {
          const projectDoc = await getDoc(doc(db, 'projects', projectId));
          if (projectDoc.exists()) {
            return {
              projectId,
              projectName: projectDoc.data().projectName
            };
          }
          return null;
        });

        const projects = (await Promise.all(projectPromises)).filter((p): p is Project => p !== null);
        setUserProjects(projects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchUserProjects();
  }, [user]);

  const validateForm = (): boolean => {
    if (!formData.jobName.trim()) {
      setError("Job name is required");
      return false;
    }
    if (!formData.jobDescription.trim()) {
      setError("Description is required");
      return false;
    }
    if (!formData.jobInstructions.trim()) {
      setError("Instructions are required");
      return false;
    }
    if (!formData.jobProjectId) {
      setError("Please select an agent");
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

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_API_CHAT}/v1/chat/completions/superinference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          jobName: formData.jobName,
          jobDescription: formData.jobDescription,
          jobInstructions: formData.jobInstructions,
          jobProjectId: formData.jobProjectId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create job');
      }

      // No redirigimos inmediatamente, dejamos que el usuario decida
      // cuando ir a la página de overview usando el botón en el modal
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to create job');
      setIsUploading(false); // Solo reseteamos isUploading si hay error
    }
  };

  const ErrorModal = () => {
    if (!error) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#1a1a1a] rounded-lg p-6 max-w-md w-full mx-4">
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
        </div>
      </div>
    );
  };

  const LoadingModal = () => {
    if (!isUploading) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-[#1a1a1a] rounded-lg p-8 max-w-md w-full mx-4">
          <h3 className="text-xl font-medium mb-2 text-center">
            Creating job
            <span className="loading-dots"></span>
          </h3>
          <p className="text-gray-400 text-center mb-6">
            This may take a few moments while we process your request
          </p>
          <button
            onClick={() => router.push('/overview/superinference')}
            className="w-full px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 
            transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2"
          >
            View status
            <IoArrowForward />
          </button>
        </div>
      </div>
    );
  };

  const filteredProjects = userProjects.filter(project => {
    const searchValue = searchBy === 'name' ? project.projectName : project.projectId;
    return searchValue.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
            <h1 className="text-3xl font-semibold mb-8 font-poppins">Create Super Inference Job</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Job Name</label>
                  <input
                    type="text"
                    className="form-input h-12"
                    placeholder="Enter job name"
                    value={formData.jobName}
                    onChange={(e) => setFormData(prev => ({ ...prev, jobName: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    className="form-input h-32"
                    placeholder="Describe what this job will do"
                    value={formData.jobDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Instructions</label>
                  <textarea
                    className="form-input h-48"
                    placeholder="Provide detailed instructions for the job"
                    value={formData.jobInstructions}
                    onChange={(e) => setFormData(prev => ({ ...prev, jobInstructions: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Select Agent</label>
                  
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1 relative">
                      <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        type="text"
                        placeholder={`Search by ${searchBy}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                        focus:border-white/30 transition-colors"
                      />
                    </div>
                    <select
                      value={searchBy}
                      onChange={(e) => setSearchBy(e.target.value as 'name' | 'id')}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                      focus:border-white/30 transition-colors"
                    >
                      <option value="name">Name</option>
                      <option value="id">ID</option>
                    </select>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {filteredProjects.map((project) => (
                      <div
                        key={project.projectId}
                        className={`agent-container ${formData.jobProjectId === project.projectId ? 'selected' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, jobProjectId: project.projectId }))}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium">{project.projectName}</h3>
                            <p className="text-white/50 text-xs font-mono mt-1">{project.projectId}</p>
                          </div>
                          <input
                            type="radio"
                            checked={formData.jobProjectId === project.projectId}
                            onChange={() => {}}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 
                transition-all duration-300 text-sm font-medium"
              >
                Create Job
              </button>
            </form>
          </div>
        </main>
      </div>
      
      <LoadingModal />
      <ErrorModal />
    </div>
  );
}
