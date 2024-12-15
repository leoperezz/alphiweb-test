'use client'

import { Team } from '../../types/team';
import { IoPeople, IoMail, IoShield, IoFolder } from 'react-icons/io5';
import { RiRobot2Line } from 'react-icons/ri';

type TeamCardProps = Team & {
  onClick: () => void;
};

export default function TeamCard({ 
  teamId,
  teamName, 
  teamDescription, 
  teamEmails = [], 
  teamAdminEmail,
  teamProjectsIds = [], 
  onClick 
}: TeamCardProps) {
  const emails = Array.isArray(teamEmails) ? teamEmails : [];
  const projects = Array.isArray(teamProjectsIds) ? teamProjectsIds : [];

  return (
    <div 
      className="p-6 bg-white/5 border border-white/10 rounded-lg font-geist transition-all duration-300 
      hover:border-white/30 hover:shadow-lg hover:bg-white/[0.07] cursor-pointer group"
      onClick={onClick}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold group-hover:text-white transition-colors">
              {teamName}
            </h3>
            <p className="text-white/50 text-xs font-mono mt-1">
              {teamId}
            </p>
          </div>
          <div className="flex items-center gap-2 text-white/50">
            <IoShield className="text-lg" />
          </div>
        </div>

        <p className="text-white/70 text-sm line-clamp-2">
          {teamDescription}
        </p>

        <div className="pt-4 border-t border-white/10">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-white/50">
              <IoPeople className="text-lg" />
              <span className="text-sm">{emails.length} members</span>
            </div>
            <div className="flex items-center gap-2 text-white/50">
              <RiRobot2Line className="text-lg" />
              <span className="text-sm">{projects.length} agents</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-white/50">
            <IoMail className="text-lg" />
            <span className="text-sm truncate">{teamAdminEmail}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
