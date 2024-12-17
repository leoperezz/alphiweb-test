/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { createContext, useContext, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: number;
  loading?: boolean;
  isToolMessage?: boolean;
}

interface Document {
  name_doc: string;
  score: number;
}

interface DocumentResponse {
  name_doc: string;
  score: number;
}

interface ChatContextType {
  messages: Message[];
  documents: Document[];
  isLoading: boolean;
  sendMessage: (message: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children, projectId }: { children: React.ReactNode, projectId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const sendMessage = async (text: string) => {
    if (!text.trim() || !user) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: text,
      sender: 'user',
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const apiMessages = messages.concat(newMessage).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      if (apiMessages.length > 20) {
        const startIndex = apiMessages.length - 20;
        const adjustedStartIndex = apiMessages[startIndex].role === 'assistant' ? startIndex + 1 : startIndex;
        apiMessages.splice(0, adjustedStartIndex);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_API_CHAT || 'http://localhost:8000'}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          stream: true,
          userId: user.uid,
          projectId: projectId
        })
      });

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      let currentAssistantMessage = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const lines = new TextDecoder().decode(value).split('\n');
        for (const line of lines) {
          if (!line.trim()) continue;
          console.log('Linea recibida:', line);
          try {
            const data = JSON.parse(line);
            
            switch (data.type) {
              case 'token':
                currentAssistantMessage += data.content;
                setMessages(prev => {
                  const filtered = prev.filter(msg => !msg.isToolMessage);
                  const last = filtered[filtered.length - 1];
                  
                  if (last?.sender === 'assistant') {
                    return [
                      ...filtered.slice(0, -1),
                      { ...last, content: currentAssistantMessage }
                    ];
                  } else {
                    return [...filtered, {
                      id: Date.now().toString(),
                      content: currentAssistantMessage,
                      sender: 'assistant',
                      timestamp: Date.now()
                    }];
                  }
                });
                break;

              case 'tool':
                setMessages(prev => [
                  ...prev.filter(msg => !msg.isToolMessage),
                  {
                    id: Date.now().toString(),
                    content: data.content,
                    sender: 'assistant',
                    timestamp: Date.now(),
                    isToolMessage: true
                  }
                ]);
                break;

              case 'documents':
                if (Array.isArray(data.content)) {
                  console.log('Documentos recibidos del stream:', data.content);
                  const newDocs = data.content.map((doc: DocumentResponse) => ({
                    name_doc: doc.name_doc,
                    score: doc.score
                  }));
                  
                  setDocuments(prev => {
                    const uniqueDocs = new Map();
                    [...prev, ...newDocs].forEach(doc => {
                      if (!uniqueDocs.has(doc.name_doc) || 
                          uniqueDocs.get(doc.name_doc).score < doc.score) {
                        uniqueDocs.set(doc.name_doc, doc);
                      }
                    });
                    return Array.from(uniqueDocs.values());
                  });
                }
                break;
            }
          } catch (e) {
            console.warn('Error parsing stream:', e);
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{
      messages,
      documents,
      isLoading,
      sendMessage
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat debe ser usado dentro de un ChatProvider');
  }
  return context;
};
