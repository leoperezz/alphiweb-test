/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../components/Header';
import { useAuth } from '../../context/AuthContext';
import { saveLlamaCloudKey, getLlamaCloudKey } from '../../config/firestore';
import { IoInformationCircle, IoClose, IoPencil } from 'react-icons/io5';

export default function Settings() {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [newApiKey, setNewApiKey] = useState('');
  const [savedKey, setSavedKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchApiKey = async () => {
      if (user) {
        const key = await getLlamaCloudKey(user.uid);
        if (key) {
          const maskedKey = maskApiKey(key);
          setSavedKey(key);
          setApiKey(maskedKey);
        }
      }
    };
    fetchApiKey();
  }, [user]);

  const maskApiKey = (key: string) => {
    if (key.length <= 4) return key;
    return '•'.repeat(key.length - 4) + key.slice(-4);
  };

  const handleSave = async () => {
    if (!user || !newApiKey.trim()) return;
    
    if (!newApiKey.startsWith('llx-')) {
      alert('La API key debe comenzar con "llx-"');
      return;
    }
    
    setIsSaving(true);
    const success = await saveLlamaCloudKey(user.uid, newApiKey);
    
    if (success) {
      setSavedKey(newApiKey);
      setApiKey(maskApiKey(newApiKey));
      setShowSuccess(true);
      setShowEditModal(false);
      setNewApiKey('');
      setTimeout(() => setShowSuccess(false), 3000);
    }
    
    setIsSaving(false);
  };

  const EditModal = () => {
    if (!showEditModal) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-[#1a1a1a] rounded-lg p-6 max-w-md w-full mx-4 border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Edit API Key</h3>
            <button 
              onClick={() => {
                setShowEditModal(false);
                setNewApiKey('');
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <IoClose size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                New Llama Cloud API Key
              </label>
              <input
                type="text"
                className="w-full form-input"
                placeholder="Enter your new API key"
                value={newApiKey}
                onChange={(e) => setNewApiKey(e.target.value)}
              />
            </div>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 transition-all duration-300 text-sm font-medium disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
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
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-semibold mb-8 font-poppins">Settings</h1>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-8">
              <div className="flex items-center gap-2 mb-2">
                <IoInformationCircle className="text-xl text-gray-300" />
                <h2 className="text-base font-medium">API Configuration</h2>
              </div>
              <p className="text-sm text-gray-300">
                Configure your Llama Cloud API key to enable AI functionalities.
                Your API key is encrypted and stored securely.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Llama Cloud API Key
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      className="flex-1 form-input bg-white/5 cursor-not-allowed"
                      value={apiKey}
                      disabled
                    />
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 transition-all duration-300 text-sm font-medium flex items-center gap-2"
                    >
                      <IoPencil />
                      Edit
                    </button>
                  </div>
                  {showSuccess && (
                    <p className="text-sm text-emerald-400 mt-2">
                      API key saved successfully!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <EditModal />
    </div>
  );
}
