// hooks/useAuthentication.ts
import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { auth } from './firebase.config';

const useAuthentication = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔐 LOGIN
  const login = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  // 📝 REGISTER
  const register = async (email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  // 🚪 LOGOUT
  const logout = async () => {
    return await signOut(auth);
  };

  // 🔄 AUTH STATE LISTENER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    user,
    loading,
    auth,
    login,
    register,
    logout,
  };
};

export default useAuthentication;