'use client'

import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import { IoClose, IoArrowForward } from 'react-icons/io5';
import Header from '../../components/Header';

export default function CreateTeam() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    teamName: '',
    description: '',
    members: [] as string[]
  });
  const [error, setError] = useState<string | null>(null);
  const [emailFields, setEmailFields] = useState([{ id: 1, value: '' }]);
  const [isUploading, setIsUploading] = useState(false);

  const validateForm = (): boolean => {
    if (!formData.teamName.trim()) {
      setError("Team name is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return false;
    }
    return true;
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const addEmailField = () => {
    setEmailFields(prev => [...prev, { id: Date.now(), value: '' }]);
  };

  const removeEmailField = (id: number) => {
    setEmailFields(prev => prev.filter(field => field.id !== id));
  };

  const handleEmailChange = (id: number, value: string) => {
    setEmailFields(prev =>
      prev.map(field =>
        field.id === id ? { ...field, value } : field
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!validateForm()) {
      return;
    }

    const validEmails = emailFields
      .map(field => field.value.trim())
      .filter(email => email && isValidEmail(email));

    if (validEmails.length === 0) {
      setError("At least one valid email is required");
      return;
    }

    setIsUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('teamAdminId', user.uid);
      formDataToSend.append('teamAdminEmail', user.email || '');
      formDataToSend.append('teamName', formData.teamName);
      formDataToSend.append('teamDescription', formData.description);
      formDataToSend.append('teamEmails', JSON.stringify(validEmails));

      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_API}/new_team`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to create team');
      }

      const data = await response.json();
      if (data.message === "Team created successfully") {
        router.push('/overview/teams');
      } else {
        setError(data.error || 'Failed to create team');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to create team');
    } finally {
      setIsUploading(false);
    }
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

  const LoadingModal = () => {
    if (!isUploading) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-[#1a1a1a] rounded-lg p-8 max-w-md w-full mx-4 text-center">
          <h3 className="text-xl font-medium mb-2">
            Creating team
            <span className="loading-dots"></span>
          </h3>
          <p className="text-gray-400 mb-4">
            Please wait while we set up your team
          </p>
          <button
            onClick={() => router.push('/overview/teams')}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2 mx-auto"
          >
            View teams
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
            <h1 className="text-3xl font-semibold mb-8 font-poppins">Create Team</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Team Name</label>
                  <input
                    type="text"
                    className="form-input h-12"
                    placeholder="Enter your team name"
                    value={formData.teamName}
                    onChange={(e) => setFormData(prev => ({ ...prev, teamName: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    className="form-input h-32"
                    placeholder="Describe the purpose of this team"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Add Members</label>
                  <div className="space-y-3">
                    {emailFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2 items-center">
                        <input
                          type="email"
                          className="form-input h-12 flex-1"
                          placeholder="Enter member email"
                          value={field.value}
                          onChange={(e) => handleEmailChange(field.id, e.target.value)}
                        />
                        {emailFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEmailField(field.id)}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                          >
                            <IoClose size={20} />
                          </button>
                        )}
                        {index === emailFields.length - 1 && (
                          <button
                            type="button"
                            onClick={addEmailField}
                            className="w-12 h-12 rounded-lg bg-white hover:bg-white/90 transition-all duration-300 flex items-center justify-center"
                          >
                            <div className="text-black text-2xl font-medium">+</div>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {emailFields.some(field => field.value && !isValidEmail(field.value)) && (
                    <p className="mt-2 text-sm text-red-400">
                      Please enter valid email addresses
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 transition-all duration-300 text-sm font-medium"
              >
                Create Team
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
