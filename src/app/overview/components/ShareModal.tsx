'use client'

import { useState } from 'react';
import { IoClose, IoSearch, IoPeople, IoFolder } from 'react-icons/io5';
import { Team } from '../../types/team';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: Team[];
  projectId: string;
}

export default function ShareModal({ isOpen, onClose, teams, projectId }: ShareModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState<'name' | 'id'>('name');
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      const formData = new FormData();
      formData.append('projectId', projectId);
      formData.append('teamIds', JSON.stringify(selectedTeams));

      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_API}/add_project_to_teams`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error sharing project');
      }

      onClose();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSharing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Loading overlay */}
      {isSharing && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-white/10 flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4" />
            <p className="text-white">Sharing project...</p>
          </div>
        </div>
      )}

      {/* Modal content */}
      <div className="bg-[#1a1a1a] rounded-lg w-full max-w-3xl border border-white/10">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Share with Teams</h2>
          <button 
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors"
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {/* Search controls */}
            <div className="flex gap-4 mb-6">
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

            {/* Teams list */}
            <div className="max-h-[400px] overflow-y-auto space-y-2 custom-scrollbar">
              {teams.filter(team => {
                const searchValue = searchBy === 'name' ? team.teamName : team.teamId;
                return searchValue.toLowerCase().includes(searchTerm.toLowerCase());
              }).map((team) => (
                <div
                  key={team.teamId}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/30 
                  cursor-pointer transition-all"
                  onClick={() => {
                    setSelectedTeams(prev => 
                      prev.includes(team.teamId)
                        ? prev.filter(id => id !== team.teamId)
                        : [...prev, team.teamId]
                    );
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{team.teamName}</h3>
                      <p className="text-white/50 text-xs font-mono mt-1">{team.teamId}</p>
                      <div className="mt-2 flex items-center gap-4">
                        <span className="text-white/50 text-sm flex items-center gap-1">
                          <IoPeople className="text-lg" />
                          {team.teamUsersCount} members
                        </span>
                        <span className="text-white/50 text-sm flex items-center gap-1">
                          <IoFolder className="text-lg" />
                          {team.teamProjectsCount} projects
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedTeams.includes(team.teamId)}
                      onChange={() => {}}
                      className="mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 flex justify-between items-center">
          <span className="text-white/50 text-sm">
            {selectedTeams.length} teams selected
          </span>
          <button
            onClick={handleShare}
            disabled={selectedTeams.length === 0 || isSharing}
            className="px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 
            transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSharing ? 'Sharing...' : 'Share with Selected Teams'}
          </button>
        </div>
      </div>
    </div>
  );
}
