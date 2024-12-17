'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../config/firestore';
import Sidebar from '../../../components/Sidebar';
import Header from '../../components/Header';
import MarkdownRendererJob from '../../components/MarkdownRendererJob';

interface JobSection {
  content: string;
  number: string;
  title: string;
}

interface JobDetails {
  jobName: string;
  jobDescription: string;
  jobSections: JobSection[];
  jobStatus: string;
  jobTotalSections: number;
  jobActualSections: number;
}

export default function JobPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');
  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return;

      try {
        const jobDoc = await getDoc(doc(db, 'superinference', jobId));
        if (jobDoc.exists()) {
          setJob(jobDoc.data() as JobDetails);
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
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
          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-white/5 rounded w-1/4 mb-4" />
              <div className="h-4 bg-white/5 rounded w-2/4 mb-8" />
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-white/5 rounded" />
                ))}
              </div>
            </div>
          ) : job ? (
            <div className="max-w-4xl mx-auto">
              <MarkdownRendererJob 
                sections={job.jobSections} 
                jobName={job.jobName}
                jobDescription={job.jobDescription}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-white/70">Job not found</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
