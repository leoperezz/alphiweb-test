'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserJobs, Job } from '../../config/firestore';
import JobCard from '../components/JobCard';
import Sidebar from '../../components/Sidebar';
import Header from '../components/Header';
import { IoAdd, IoSearch } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

export default function SuperInferencePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return;
      
      try {
        const userJobs = await getUserJobs(user.uid);
        setJobs(userJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user]);

  const filteredJobs = jobs.filter(job =>
    job.jobName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <h1 className="text-2xl font-medium">Super Inference Jobs</h1>
              <span className="experimental-badge">
                Experimental
              </span>
            </div>
            
            {/* Barra de búsqueda y botón de crear */}
            <div className="mb-6 flex gap-4 items-center">
              <div className="flex-1 relative">
                <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 
                  transition-all duration-300 hover:border-white/30 focus:border-white/30 focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => router.push('/overview/superinference/create')}
                className="px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 
                transition-all duration-300 text-sm font-medium flex items-center gap-2 whitespace-nowrap"
              >
                <IoAdd className="text-lg" />
                Create Job
              </button>
            </div>

            {loading ? (
              <div className="grid gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white/5 rounded-lg h-40" />
                ))}
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="grid gap-4">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.jobId}
                    {...job}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-white/70 text-xl mb-2">No jobs found</p>
                <p className="text-white/50 text-sm">
                  Create your first job to get started. New jobs may take a few moments to appear.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
