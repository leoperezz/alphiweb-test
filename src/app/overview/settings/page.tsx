/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../components/Header';
import { useAuth } from '../../context/AuthContext';
import { IoInformationCircle, IoClose, IoPencil, IoAdd, IoTrash, IoCopy } from 'react-icons/io5';
import { getUserApiKeys } from '../../config/firestore';
import Image from 'next/image';

export default function Settings() {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApiKeys = async () => {
      if (user) {
        const keys = await getUserApiKeys(user.uid);
        setApiKeys(keys);
      }
    };
    fetchApiKeys();
  }, [user]);

  const maskApiKey = (key: string) => {
    if (key.length <= 4) return key;
    return '•'.repeat(key.length - 4) + key.slice(-4);
  };

  const handleCreateApiKey = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('userId', user.uid);

      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_API}/create_api_key`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        setApiKeys(prev => [...prev, data.api_key]);
        showSuccessMessage('API key created successfully');
      } else {
        setError(data.message || 'Error creating API key');
      }
    } catch (error) {
      setError('Error creating API key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteApiKey = async (apiKey: string) => {
    if (!user) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('userId', user.uid);
      formData.append('api_key', apiKey);

      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_API}/delete_api_key`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setApiKeys(prev => prev.filter(key => key !== apiKey));
        showSuccessMessage('API key deleted successfully');
      } else {
        const data = await response.json();
        setError(data.message || 'Error deleting API key');
      }
    } catch (error) {
      setError('Error deleting API key');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (apiKey: string) => {
    try {
      await navigator.clipboard.writeText(apiKey);
      showSuccessMessage('API key copied to clipboard');
    } catch (err) {
      setError('Failed to copy API key');
    }
  };

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
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
            <h1 className="text-3xl font-semibold mb-8 font-poppins">Settings</h1>

            {/* User Profile Section */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-6">
                {user?.photoURL && (
                  <Image
                    src={user.photoURL}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-medium mb-4">{user?.displayName}</h2>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>User ID: <span className="font-mono">{user?.uid}</span></p>
                    <p>Email: {user?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* API Keys Section */}
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">API Keys</h3>
                  <button
                    onClick={handleCreateApiKey}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 transition-all duration-300 text-sm font-medium flex items-center gap-2"
                  >
                    <IoAdd />
                    Create New Key
                  </button>
                </div>

                <div className="space-y-4">
                  {apiKeys.map((key, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                      <input
                        type="text"
                        className="flex-1 form-input bg-white/5 cursor-not-allowed"
                        value={maskApiKey(key)}
                        disabled
                      />
                      <button
                        onClick={() => copyToClipboard(key)}
                        className="text-white/70 hover:text-white transition-colors p-2"
                        title="Copy API key"
                      >
                        <IoCopy size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteApiKey(key)}
                        className="text-red-400 hover:text-red-300 transition-colors p-2"
                        title="Delete API key"
                      >
                        <IoTrash size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="fixed bottom-4 right-4 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg border border-emerald-500/30">
                {successMessage}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="fixed bottom-4 right-4 bg-red-500/20 text-red-400 px-4 py-2 rounded-lg border border-red-500/30">
                {error}
              </div>
            )}

            {/* Loading Overlay */}
            {isLoading && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/10">
                  <div className="loading-spinner mb-4"></div>
                  <p className="text-center">Processing request...</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
