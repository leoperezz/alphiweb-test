/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import Link from 'next/link';
import { useState } from 'react';
import { FiUsers, FiGrid, FiSettings } from 'react-icons/fi';
import { IoChevronUpOutline, IoChevronDownOutline, IoPersonCircleOutline, IoLogOutOutline } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="w-64 h-screen bg-black border-r border-white/10 font-geist flex flex-col text-sm">
      <div className="p-6 flex justify-center border-b border-white/10">
        <Link href="/overview" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-full logo-circle"></div>
          <span className="text-2xl font-semibold font-poppins typewriter-text">
            Alphi
          </span>
        </Link>
      </div>
      
      <nav className="mt-6 flex-1">
        <Link href="/overview" className="flex items-center gap-3 px-6 py-2.5 text-white/70 hover:text-white hover:bg-white/5">
          <FiUsers className="text-lg" />
          <span>Agents</span>
        </Link>
        
        <Link href="/overview/dashboard" className="flex items-center gap-3 px-6 py-2.5 text-white/70 hover:text-white hover:bg-white/5">
          <FiGrid className="text-lg" />
          <span>Dashboard</span>
        </Link>
        
        <Link href="/overview/settings" className="flex items-center gap-3 px-6 py-2.5 text-white/70 hover:text-white hover:bg-white/5">
          <FiSettings className="text-lg" />
          <span>Settings</span>
        </Link>
      </nav>

      {/* User section - simplificado */}
      <div className="mt-auto pt-3 border-t border-white/10">
        <button 
          onClick={handleLogout}
          className="logout-button"
        >
          <IoLogOutOutline size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
