/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firestore';
import { IoSend, IoArrowBack } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import MarkdownRenderer from '../components/MarkdownRenderer';
import SidebarChat from '../components/SidebarChat';
import { ChatProvider, useChat } from '../context/ChatContext';

interface Message {
  content: string;
  sender: 'user' | 'assistant';
  timestamp: number;
}

function ChatContent() {
  const [inputMessage, setInputMessage] = useState('');
  const [projectName, setProjectName] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');
  
  const { 
    messages, 
    documents, 
    sendMessage, 
    isLoading,
    isSidebarOpen,
    setIsSidebarOpen 
  } = useChat();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!projectId) return;
      
      try {
        const projectDoc = await getDoc(doc(db, 'projects', projectId));
        if (projectDoc.exists()) {
          setProjectName(projectDoc.data().projectName);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  useEffect(() => {
    console.log('Documents en ChatContent:', documents);
    console.log('Estado del sidebar:', isSidebarOpen);
  }, [documents, isSidebarOpen]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    sendMessage(inputMessage);
    setInputMessage('');
  };

  console.log('Rendering SidebarChat with:', { documents, isSidebarOpen });

  return (
    <div className="flex h-screen bg-black text-white font-geist">
      <SidebarChat 
        documents={documents}
        isOpen={isSidebarOpen}
        onToggle={() => {
          console.log('Toggle sidebar called, current state:', isSidebarOpen);
          setIsSidebarOpen(!isSidebarOpen);
        }}
      />

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isSidebarOpen ? 'mr-96' : 'mr-0'
      }`}>
        {/* Header */}
        <div className="flex items-center p-6 border-b border-white/10">
          <button 
            onClick={() => router.back()} 
            className="mr-4 hover:text-white/70"
          >
            <IoArrowBack size={24} />
          </button>
          <h1 className="text-3xl font-semibold font-poppins">{projectName}</h1>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                } ${message.isToolMessage ? 'animate-fade-in' : ''}`}
              >
                {message.sender === 'assistant' && (
                  <div className="w-6 h-6 bg-white rounded-sm flex-shrink-0" />
                )}
                <div
                  className={`${
                    message.sender === 'user'
                      ? 'bg-zinc-800 text-white max-w-[80%] rounded-lg px-4 py-2 text-sm whitespace-pre-wrap'
                      : `text-white max-w-[80%] text-sm prose prose-invert ${
                          message.isToolMessage ? 'tool-message-wrapper' : ''
                        }`
                  }`}
                >
                  {message.sender === 'assistant' ? (
                    <div className={`markdown-content ${
                      message.isToolMessage ? 'tool-message' : ''
                    }`}>
                      <MarkdownRenderer content={message.content} />
                    </div>
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="flex justify-center pb-8">
          <div className="w-full max-w-4xl mx-auto px-6 flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-zinc-800/50 border border-white/10 rounded-lg px-4 py-2.5
                       focus:outline-none focus:border-white/30 text-sm"
            />
            <button
              onClick={handleSendMessage}
              className="bg-white text-black px-4 rounded-lg hover:bg-white/90 transition-colors"
            >
              <IoSend size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* You might want to add a loading indicator when messages are being sent */}
      {isLoading && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2">
          <div className="bg-zinc-800 px-4 py-2 rounded-lg text-sm">
            AI is typing...
          </div>
        </div>
      )}
    </div>
  );
}

export default function Chat() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');

  if (!projectId) return null;

  return (
    <ChatProvider projectId={projectId}>
      <ChatContent />
    </ChatProvider>
  );
}
