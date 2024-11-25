/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  pages: number[];
  text: string;
  score: number;
}

interface DocumentResponse {
  name_doc: string;
  pages: number | number[];
  text: string;
  score: number;
}

interface ChatContextType {
  messages: Message[];
  documents: Document[];
  isConnected: boolean;
  sendMessage: (message: string) => void;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children, projectId }: { children: React.ReactNode, projectId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const { user } = useAuth();
  const socketRef = useRef<WebSocket | null>(null);

  const isConnected = connectionStatus === 'connected';

  const connectWebSocket = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws';
      socketRef.current = new WebSocket(wsUrl);
      setConnectionStatus('connecting');

      socketRef.current.onopen = () => {
        if (socketRef.current && user) {
          const credentials = {
            userId: user.uid,
            projectId: projectId
          };
          socketRef.current.send(JSON.stringify(credentials));
          setConnectionStatus('connected');
        }
      };

      socketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'tool':
              setMessages(prev => [
                ...prev.filter(msg => !msg.isToolMessage),
                {
                  id: Date.now().toString(),
                  content: data.content,
                  sender: 'assistant',
                  timestamp: Date.now(),
                  loading: true,
                  isToolMessage: true
                }
              ]);
              break;

            case 'chunk':
              if (data.content && data.content !== '') {
                setMessages(prev => {
                  const filteredMessages = prev.filter(msg => !msg.isToolMessage);
                  const lastMessage = filteredMessages[filteredMessages.length - 1];
                  
                  if (lastMessage?.sender === 'assistant' && !lastMessage.isToolMessage) {
                    return [
                      ...filteredMessages.slice(0, -1),
                      {
                        ...lastMessage,
                        content: lastMessage.content + data.content,
                        loading: false
                      }
                    ];
                  } else {
                    return [
                      ...filteredMessages,
                      {
                        id: Date.now().toString(),
                        content: data.content,
                        sender: 'assistant',
                        timestamp: Date.now(),
                        loading: false
                      }
                    ];
                  }
                });
              }
              break;

            case 'documents':
              const formattedDocs = data.content.map((doc: DocumentResponse) => ({
                name_doc: doc.name_doc,
                pages: Array.isArray(doc.pages) ? doc.pages : [doc.pages],
                text: doc.text,
                score: doc.score
              }));
              setDocuments(formattedDocs);
              break;
          }
        } catch (error) {
          console.warn('Error al procesar mensaje:', error);
        }
      };

      socketRef.current.onclose = () => {
        setConnectionStatus('disconnected');
      };

      socketRef.current.onerror = () => {
        setConnectionStatus('disconnected');
      };

    } catch (error) {
      console.warn('Error al establecer conexión WebSocket');
      setConnectionStatus('disconnected');
    }
  };

  useEffect(() => {
    if (user && projectId) {
      connectWebSocket();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [user, projectId, connectWebSocket]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: text,
      sender: 'user',
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ message: text }));
    }
  };

  return (
    <ChatContext.Provider value={{
      messages,
      documents,
      isConnected,
      sendMessage,
      connectionStatus
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
