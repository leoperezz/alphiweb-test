import { LuEye } from "react-icons/lu";
import { useRouter } from 'next/navigation';

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
  const isCompleted = jobTotalSections > 0 && jobActualSections === jobTotalSections;

  const getStatusColor = (status: string, isCompleted: boolean) => {
    if (isCompleted) return 'status-badge-completed';
    return 'status-badge-progress';
  };

  const getProgressColor = (isCompleted: boolean) => {
    if (isCompleted) return 'progress-bar-green';
    return 'progress-bar-blue';
  };

  return (
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
          onClick={() => router.push(`/overview/superinference/jobs?jobId=${jobId}`)}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
          title="View details"
        >
          <LuEye className="text-white/70 hover:text-white text-lg" />
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
  );
}
