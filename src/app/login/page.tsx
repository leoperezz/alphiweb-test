'use client'
import { FcGoogle } from 'react-icons/fc'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signInWithGoogle } = useAuth();

  return (
    <main className="h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <div className="w-12 h-12 bg-white rounded-full animate-pulse"></div>
        <button 
          className="login-with-google-btn"
          onClick={signInWithGoogle}
        >
          <FcGoogle className="text-2xl mr-2 white-icon" />
          Sign in with Google
        </button>
      </div>
    </main>
  )
}
