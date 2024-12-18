import { LuEye } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface JobSection {
  content: string;
  number: string;
  title: string;
}

interface JobCardProps {
  jobId: string;
  jobName: string;
  jobDescription: string;
  jobSections: JobSection[];
  jobTotalSections: number;
  jobActualSections: number;
  jobStatus: string;
}

export default function JobCard({ 
  jobId, 
  jobName, 
  jobDescription, 
  jobTotalSections, 
  jobActualSections,
  jobStatus 
}: JobCardProps) {
  const progress = (jobActualSections / jobTotalSections) * 100;
  const router = useRouter();
  const [showWaitModal, setShowWaitModal] = useState(false);
  const isCompleted = jobTotalSections > 0 && jobActualSections === jobTotalSections;

  const getStatusColor = (status: string, isCompleted: boolean) => {
    if (isCompleted) return 'status-badge-completed';
    return 'status-badge-progress';
  };

  const getProgressColor = (isCompleted: boolean) => {
    if (isCompleted) return 'progress-bar-green';
    return 'progress-bar-blue';
  };

  const handleViewClick = () => {
    if (isCompleted) {
      router.push(`/overview/superinference/jobs?jobId=${jobId}`);
    } else {
      setShowWaitModal(true);
    }
  };

  const WaitModal = () => {
    if (!showWaitModal) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-[#1a1a1a] rounded-lg p-8 max-w-md w-full mx-4 relative">
          <button 
            onClick={() => setShowWaitModal(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <IoClose size={20} />
          </button>
          <h3 className="text-xl font-medium mb-4 text-center">Job in Progress</h3>
          <p className="text-gray-400 text-center">
            Please wait until the job is completed to view the results. This process may take a few minutes.
          </p>
          <div className="mt-6 text-center">
            <span className="text-white/50 text-sm">
              Current Progress: {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-lg">{jobName}</h3>
              <span className={`status-badge ${getStatusColor(jobStatus, isCompleted)}`}>
                {jobStatus}
              </span>
            </div>
            <p className="text-white/50 text-xs mb-2">ID: {jobId}</p>
            <p className="text-white/70 text-sm">{jobDescription}</p>
          </div>
          <button
            onClick={handleViewClick}
            className={`p-2 rounded-lg transition-all ${
              isCompleted 
                ? 'bg-white/5 hover:bg-white/10' 
                : 'bg-white/5 cursor-not-allowed'
            }`}
            title={isCompleted ? "View details" : "Job in progress"}
          >
            <LuEye className={`text-lg ${
              isCompleted 
                ? 'text-white/70 hover:text-white' 
                : 'text-white/30'
            }`} />
          </button>
        </div>
        
        {jobTotalSections > 0 && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/50 text-xs">Progress</span>
              <span className="text-white/50 text-xs">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-white/10">
              <div 
                className={`h-full ${getProgressColor(isCompleted)} transition-all duration-500`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
      <WaitModal />
    </>
  );
}
