'use client'

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import Header from '../../components/Header';
import { IoAdd, IoSearch, IoClose, IoChatbubbles } from 'react-icons/io5';
import AgentCard from '../../components/AgentCard';
import { getTeamInfo } from '../../../config/firestore';
import { Team } from '../../../types/team';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../config/firestore';

interface TeamAgent {
  projectId: string;
  projectName: string;
  projectStatus: 'active' | 'building' | 'inactive';
  projectCreatedAt: string;
  projectLoading: number;
  projectMessage: string;
  projectTypeModel: 'basic' | 'lightrag';
  projectDescription: string;
  projectAssistantName: string;
  projectFileNames: string[];
}

export default function TeamPlatform() {
  const searchParams = useSearchParams();
  const teamId = searchParams.get('teamId');
  const router = useRouter();
  
  const [teamData, setTeamData] = useState<Team | null>(null);
  const [agents, setAgents] = useState<TeamAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [agentSearchTerm, setAgentSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<TeamAgent | null>(null);
  const [activeTab, setActiveTab] = useState<'members' | 'agents'>('members');

  useEffect(() => {
    const fetchTeamData = async () => {
      if (teamId) {
        try {
          const team = await getTeamInfo(teamId);
          if (team) {
            setTeamData(team);
            
            // Fetch agents data
            if (team.teamProjectsIds) {
              const agentPromises = team.teamProjectsIds.map(async (projectId) => {
                const projectDoc = await getDoc(doc(db, 'projects', projectId));
                if (projectDoc.exists()) {
                  return {
                    projectId,
                    ...projectDoc.data()
                  } as TeamAgent;
                }
                return null;
              });

              const agentsData = (await Promise.all(agentPromises)).filter((a): a is TeamAgent => a !== null);
              setAgents(agentsData);
            }
          }
        } catch (error) {
          console.error('Error fetching team data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTeamData();
  }, [teamId]);

  const filteredMembers = teamData?.teamEmails?.filter(email =>
    email.toLowerCase().includes(memberSearchTerm.toLowerCase())
  ) || [];

  const filteredAgents = agents.filter(agent =>
    agent.projectName.toLowerCase().includes(agentSearchTerm.toLowerCase())
  );

  const handleAgentClick = (agent: TeamAgent) => {
    setSelectedAgent(agent);
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
            <h1 className="text-3xl font-semibold mb-8 font-poppins">{teamData?.teamName || 'Team Platform'}</h1>

            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setActiveTab('members')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'members'
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                Members
              </button>
              <button
                onClick={() => setActiveTab('agents')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'agents'
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                Agents
              </button>
            </div>

            {activeTab === 'members' && (
              <section>
                <div className="mb-4">
                  <div className="relative">
                    <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="text"
                      placeholder="Search members..."
                      value={memberSearchTerm}
                      onChange={(e) => setMemberSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                      focus:border-white/30 transition-colors"
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-white/70">Loading...</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMembers.map((email, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm text-white">{email}</p>
                          <span className={`text-xs ${
                            email === teamData?.teamAdminEmail ? 'text-blue-400' : 'text-gray-400'
                          }`}>
                            {email === teamData?.teamAdminEmail ? 'admin' : 'member'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {activeTab === 'agents' && (
              <section>
                <div className="mb-4">
                  <div className="relative">
                    <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="text"
                      placeholder="Search agents..."
                      value={agentSearchTerm}
                      onChange={(e) => setAgentSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                      focus:border-white/30 transition-colors"
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-white/70">Loading...</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAgents.map((agent) => (
                      <AgentCard
                        key={agent.projectId}
                        name={agent.projectName}
                        projectId={agent.projectId}
                        created={agent.projectCreatedAt}
                        status={agent.projectStatus}
                        message={agent.projectMessage}
                        progress={agent.projectLoading}
                        projectTypeModel={agent.projectTypeModel}
                        onClick={() => handleAgentClick(agent)}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        </main>
      </div>

      {selectedAgent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-lg max-w-2xl w-full max-h-[90vh] border border-white/10 flex flex-col">
            <div className="p-6 border-b border-white/10 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-1">{selectedAgent.projectName}</h2>
                <p className="text-white/50 text-sm font-mono">{selectedAgent.projectId}</p>
              </div>
              <button 
                onClick={() => setSelectedAgent(null)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <IoClose className="text-xl" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h3 className="text-white/50 text-sm mb-1">Status</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs inline-block ${
                    selectedAgent.projectStatus === 'active' ? 'bg-emerald-500/20 text-emerald-500' :
                    selectedAgent.projectStatus === 'building' ? 'bg-blue-500/20 text-blue-500' :
                    'bg-red-500/20 text-red-500'
                  }`}>
                    {selectedAgent.projectStatus}
                  </span>
                </div>
                <div>
                  <h3 className="text-white/50 text-sm mb-1">Created At</h3>
                  <p className="text-white">{selectedAgent.projectCreatedAt}</p>
                </div>
                <div>
                  <h3 className="text-white/50 text-sm mb-1">Message</h3>
                  <p className="text-white">{selectedAgent.projectMessage}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/10 flex justify-end gap-3 mt-auto sticky bottom-0 bg-[#1a1a1a]">
              <button 
                onClick={() => router.push(`/overview/chat?projectId=${selectedAgent.projectId}`)}
                className="px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 transition-all duration-300 text-sm flex items-center gap-2"
              >
                <IoChatbubbles />
                Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
