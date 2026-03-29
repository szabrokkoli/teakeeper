import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

/**
 * @typedef {Object} AuthContextType
 * @property {any} session
 * @property {any} user
 * @property {any} profile
 * @property {boolean} loading
 * @property {(data: any) => Promise<any>} signUp
 * @property {(data: any) => Promise<any>} signIn
 * @property {() => Promise<any>} signOut
 * @property {React.Dispatch<React.SetStateAction<any>>} setProfile
 */
/** @type {import('react').Context<AuthContextType>} */
const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      if (!user) {
        if (isMounted) setProfile(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        if (isMounted) setProfile(data);
      } catch (err) {
        console.error("Profil lekérési hiba:", err);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [user]); 

  const value = {
    session,
    user,
    profile,
    setProfile, // lehetővé teszi a profil state frissítését kívülről
    loading,
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signOut: () => supabase.auth.signOut(),
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="adminLoading">
          Rendszer betöltése...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};