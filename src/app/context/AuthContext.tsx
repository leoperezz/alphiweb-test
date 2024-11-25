'use client'
import { createContext, useContext, useEffect, useState } from 'react';
import { 
  GoogleAuthProvider, 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { checkUserExists } from '../config/firestore';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const createNewUser = async (user: User) => {
    try {
      const formData = new FormData();
      formData.append('userId', user.uid);
      formData.append('userName', user.displayName || '');
      formData.append('userEmail', user.email || '');

      const endpoint = `${process.env.NEXT_PUBLIC_ENDPOINT_API}/new_user`;
      console.log('Endpoint URL:', endpoint);

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.status}`);
      }

      const data = await response.json();
      console.log('User created successfully:', data);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Verificar si el usuario ya existe en Firestore
        const exists = await checkUserExists(user.uid);
        if (!exists) {
          // Si no existe, crear el usuario
          await createNewUser(user);
        }
      }
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Verificar si es un nuevo usuario
      const exists = await checkUserExists(result.user.uid);
      if (!exists) {
        await createNewUser(result.user);
      }
      
      router.push('/overview');
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
