'use client'

import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import TeamCard from '../components/TeamCard';
import { IoAdd, IoClose, IoSearch, IoPeople, IoMail, IoShield } from 'react-icons/io5';
import Header from '../components/Header';
import { useRouter } from 'next/navigation';

interface Team {
  teamName: string;
  teamId: string;
  teamDescription: string;
  teamEmails: string[];
  teamAdminEmail: string;
}

// Mock data
const mockTeams: Team[] = [
  {
    teamName: "Development Team Alpha",
    teamId: "team_001",
    teamDescription: "Main development team focused on frontend and backend development of our core products.",
    teamEmails: ["john.doe@company.com", "jane.smith@company.com", "bob.wilson@company.com"],
    teamAdminEmail: "admin.alpha@company.com"
  },
  {
    teamName: "Design Squad",
    teamId: "team_002",
    teamDescription: "Creative team responsible for UI/UX design and brand identity across all platforms.",
    teamEmails: ["sarah.designer@company.com", "mike.artist@company.com"],
    teamAdminEmail: "design.lead@company.com"
  },
  {
    teamName: "AI Research Group",
    teamId: "team_003",
    teamDescription: "Specialized team working on artificial intelligence and machine learning implementations.",
    teamEmails: ["ai.researcher1@company.com", "ml.expert@company.com", "data.scientist@company.com"],
    teamAdminEmail: "ai.lead@company.com"
  }
];

export default function Teams() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [emailSearchTerm, setEmailSearchTerm] = useState('');
  const router = useRouter();

  const filteredTeams = mockTeams.filter(team =>
    team.teamName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEmails = selectedTeam?.teamEmails.filter(email =>
    email.toLowerCase().includes(emailSearchTerm.toLowerCase())
  ) || [];

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeams.map((team) => (
                <div
                  key={team.teamId}
                  onClick={() => setSelectedTeam(team)}
                  className="group p-6 rounded-lg bg-white/5 border border-white/10 hover:border-white/30 
                             transition-all duration-300 cursor-pointer space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium mb-1 group-hover:text-white transition-colors">
                        {team.teamName}
                      </h3>
                      <p className="text-sm text-white/50 font-mono">{team.teamId}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded">
                      <IoPeople className="text-blue-400" />
                      <span className="text-sm text-white/70">{team.teamEmails.length}</span>
                    </div>
                  </div>

                  <p className="text-sm text-white/70 line-clamp-2">
                    {team.teamDescription}
                  </p>

                  <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <IoShield className="text-emerald-400" />
                      <span className="text-white/70">Admin:</span>
                      <span className="text-white/90 truncate flex-1">
                        {team.teamAdminEmail}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs text-white/50 flex items-center gap-1">
                      <IoMail className="text-blue-400" />
                      <span>Recent members:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {team.teamEmails.slice(0, 2).map((email, index) => (
                        <span
                          key={index}
                          className="text-xs bg-white/5 px-2 py-1 rounded-full text-white/70"
                        >
                          {email}
                        </span>
                      ))}
                      {team.teamEmails.length > 2 && (
                        <span className="text-xs bg-white/5 px-2 py-1 rounded-full text-white/70">
                          +{team.teamEmails.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/overview/teams/platform?teamId=${team.teamId}`);
                      }}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 
                                 text-white text-sm font-medium transition-all duration-300"
                    >
                      View Platform
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Modal for team details */}
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
                    {selectedTeam.teamEmails.length}
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
                  {filteredEmails.map((email, index) => (
                    <div 
                      key={index}
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
                onClick={() => router.push(`/overview/teams/platform?teamId=${selectedTeam.teamId}`)}
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
