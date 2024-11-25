'use client'

import { useState, useEffect } from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';
import { useAuth } from '../../context/AuthContext';
import { getUserNotifications } from '../../config/firestore';

interface Notification {
  date: string;
  message: string;
}

export default function Header() {
  const [showEmail, setShowEmail] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  useEffect(() => {
    if (user?.photoURL) {
      setPhotoURL(user.photoURL);
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (user?.uid) {
      const userNotifications = await getUserNotifications(user.uid);
      setNotifications(userNotifications);
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      fetchNotifications();
    }
  };

  return (
    <div className="h-16 border-b border-white/10 bg-black flex items-center justify-end px-8 gap-4">
      <div className="relative">
        <button 
          onClick={handleNotificationClick}
          className="text-white/70 hover:text-white"
        >
          <IoNotificationsOutline size={24} />
        </button>

        {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 bg-[#1A1A1A] rounded-lg shadow-lg border border-white/10 z-50 overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-sm font-medium">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <div
                    key={index}
                    className="p-4 border-b border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <p className="text-sm text-white/90 mb-1">{notification.message}</p>
                    <p className="text-xs text-white/50">{new Date(notification.date).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-white/50 text-sm">
                  No notifications
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="relative">
        <button 
          onClick={() => setShowEmail(!showEmail)}
          className="w-10 h-10 rounded overflow-hidden"
        >
          {photoURL ? (
            <img 
              src={photoURL} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-600 flex items-center justify-center text-white">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          )}
        </button>

        {showEmail && (
          <div className="absolute right-0 mt-2 bg-[#1A1A1A] rounded-md py-2 px-4 shadow-lg border border-white/10 z-50">
            <span className="text-sm text-gray-400">{user?.email}</span>
          </div>
        )}
      </div>
    </div>
  );
}
