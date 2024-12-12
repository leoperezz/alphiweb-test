'use client'

interface TeamCardProps {
  teamName: string;
  teamId: string;
  teamDescription: string;
  teamEmails: string[];
  teamAdminEmail: string;
  onClick: () => void;
}

export default function TeamCard({ teamName, teamDescription, onClick }: TeamCardProps) {
  return (
    <div 
      className="p-6 border border-white/10 rounded-lg font-geist text-sm transition-all duration-300 
      hover:border-white/30 hover:shadow-lg hover:bg-white/5 max-w-sm cursor-pointer flex flex-col h-full"
      onClick={onClick}
    >
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-4">{teamName}</h3>
        <div className="space-y-3">
          <p className="text-white/70 text-sm">
            {teamDescription.length > 100 
              ? `${teamDescription.substring(0, 100)}...` 
              : teamDescription}
          </p>
        </div>
      </div>
    </div>
  );
}
