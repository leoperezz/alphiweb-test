'use client'

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import TeamCard from '../components/TeamCard';
import { IoAdd, IoClose, IoSearch, IoPeople } from 'react-icons/io5';
import Header from '../components/Header';
import { useRouter } from 'next/navigation';
import { getAllUserTeams } from '../../config/firestore';
import { Team } from '../../types/team';

export default function Teams() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [emailSearchTerm, setEmailSearchTerm] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchTeams = async () => {
      if (user) {
        try {
          const userTeams = await getAllUserTeams(user.uid);
          setTeams(userTeams);
        } catch (error) {
          console.error('Error fetching teams:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTeams();
  }, [user]);

  const filteredTeams = useMemo(() => 
    teams.filter(team =>
      team.teamName.toLowerCase().includes(searchTerm.toLowerCase())
    ), [teams, searchTerm]
  );

  const handlePlatformClick = (teamId: string) => {
    router.push(`/overview/teams/platform?teamId=${teamId}`);
  };

  const renderTeamsList = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-white/70">Loading...</div>
        </div>
      );
    }

    if (filteredTeams.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-white/70">
          <IoPeople className="text-6xl mb-4 text-white/20" />
          <p className="text-xl mb-2">No teams found</p>
          <p className="text-sm">Create a team to get started</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <TeamCard
            key={team.teamId}
            {...team}
            onClick={() => setSelectedTeam(team)}
          />
        ))}
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
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-semibold mb-8 font-poppins">Teams</h1>
            
            <div className="mb-6 flex gap-4 items-center">
              <input
                type="text"
                placeholder="Search teams..."
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 transition-all duration-300 hover:border-white/30 focus:border-white/30 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                onClick={() => router.push('/overview/teams/create')}
                className="px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 transition-all duration-300 text-sm font-medium flex items-center gap-2 whitespace-nowrap"
              >
                <IoAdd className="text-lg" />
                Create Team
              </button>
            </div>

            {renderTeamsList()}
          </div>
        </main>
      </div>

      {selectedTeam && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-lg max-w-2xl w-full max-h-[90vh] border border-white/10 flex flex-col">
            <div className="p-6 border-b border-white/10 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-1">{selectedTeam.teamName}</h2>
                <p className="text-white/50 text-sm font-mono">{selectedTeam.teamId}</p>
              </div>
              <button 
                onClick={() => setSelectedTeam(null)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <IoClose className="text-xl" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h3 className="text-white/50 text-sm mb-1">Description</h3>
                  <p className="text-white">{selectedTeam.teamDescription}</p>
                </div>
                <div>
                  <h3 className="text-white/50 text-sm mb-1">Admin Email</h3>
                  <p className="text-white">{selectedTeam.teamAdminEmail}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-white/50 text-sm">Team Members</h3>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                    {selectedTeam.teamEmails?.length || 0}
                  </span>
                </div>
                
                <div className="relative mb-4">
                  <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search emails..."
                    value={emailSearchTerm}
                    onChange={(e) => setEmailSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                    focus:border-white/30 transition-colors"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto modal-scroll space-y-2">
                  {selectedTeam.teamEmails?.map((email) => (
                    <div 
                      key={`email-${email}`}
                      className="p-2 rounded-lg bg-white/5 border border-white/10"
                    >
                      {email}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/10 flex justify-end gap-3 mt-auto sticky bottom-0 bg-[#1a1a1a]">
              <button
                onClick={() => handlePlatformClick(selectedTeam.teamId)}
                className="px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 transition-all duration-300 text-sm flex items-center gap-2"
              >
                Platform
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
