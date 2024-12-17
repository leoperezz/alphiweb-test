/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firestore';
import { IoSend, IoArrowBack } from 'react-icons/io5';
import { 
  IoDocumentText, 
  IoDocument,
  IoLogoMarkdown 
} from 'react-icons/io5';
import { 
  AiFillFilePdf, 
  AiFillFileWord,
  AiFillFilePpt 
} from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { ChatProvider, useChat } from '../context/ChatContext';

interface Message {
  content: string;
  sender: 'user' | 'assistant';
  timestamp: number;
  isToolMessage?: boolean;
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
    isLoading 
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

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
  }, [documents]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    sendMessage(inputMessage);
    setInputMessage('');
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'md':
        return <IoLogoMarkdown className="text-blue-400" size={20} />;
      case 'txt':
        return <IoDocumentText className="text-gray-400" size={20} />;
      case 'pdf':
        return <AiFillFilePdf className="text-red-400" size={20} />;
      case 'pptx':
        return <AiFillFilePpt className="text-orange-400" size={20} />;
      case 'docx':
        return <AiFillFileWord className="text-blue-500" size={20} />;
      default:
        return <IoDocument className="text-gray-400" size={20} />;
    }
  };

  return (
    <div className="flex h-screen bg-black text-white font-geist">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
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
              <div key={message.id} className="space-y-4">
                <div className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                  {message.sender === 'assistant' && (
                    <div className="w-6 h-6 bg-white rounded-sm flex-shrink-0" />
                  )}
                  <div className={
                    message.sender === 'user' 
                      ? 'bg-zinc-800 text-white max-w-[80%] rounded-lg px-4 py-2 text-sm whitespace-pre-wrap'
                      : message.isToolMessage
                        ? 'tool-message-content max-w-[80%] text-sm'
                        : 'text-white max-w-[80%] text-sm prose prose-invert'
                  }>
                    {message.sender === 'assistant' ? (
                      message.isToolMessage ? (
                        <span className="tool-message">{message.content}</span>
                      ) : (
                        <MarkdownRenderer content={message.content} />
                      )
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
                
                {/* Render documents after AI message */}
                {message.sender === 'assistant' && documents.length > 0 && index === messages.length - 1 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-white/60">Sources:</p>
                    <div className="flex flex-wrap gap-2">
                      {documents.map((doc, idx) => (
                        <div key={idx} className="source-document">
                          <div className="flex items-center gap-2">
                            {getFileIcon(doc.name_doc)}
                            <span className="text-sm">{doc.name_doc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
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

      {/* Loading indicator */}
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
