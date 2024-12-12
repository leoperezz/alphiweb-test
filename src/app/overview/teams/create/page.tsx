'use client'

import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import { IoClose } from 'react-icons/io5';
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
  const [memberEmail, setMemberEmail] = useState('');

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

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (memberEmail.trim() && !formData.members.includes(memberEmail)) {
      setFormData(prev => ({
        ...prev,
        members: [...prev.members, memberEmail.trim()]
      }));
      setMemberEmail('');
    }
  };

  const removeMember = (emailToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter(email => email !== emailToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!validateForm()) {
      return;
    }

    try {
      // Aquí iría la lógica para crear el equipo
      router.push('/overview/teams');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to create team');
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
                  <div className="flex gap-2">
                    <input
                      type="email"
                      className="form-input h-12 flex-1"
                      placeholder="Enter member email"
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleAddMember}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  
                  {formData.members.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.members.map((email) => (
                        <div 
                          key={email}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                        >
                          <span className="text-sm text-gray-300">{email}</span>
                          <button
                            type="button"
                            onClick={() => removeMember(email)}
                            className="text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <IoClose size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
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
      
      <ErrorModal />
    </div>
  );
}
