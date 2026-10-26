import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/wellness';
import { psygmaApi, getToken, STORAGE_KEYS } from '../services/api';
import { INITIAL_USER } from '../constants/demoData';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile;
  login: (email: string, pass: string) => Promise<boolean>;
  loginAsDemo: () => Promise<boolean>;
  signup: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (profile: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(getToken());
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);

  // Validate session against backend on mount / page refresh
  useEffect(() => {
    const validateSession = async () => {
      const token = getToken();
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await psygmaApi.getMe();
        setUser(currentUser);
        setIsAuthenticated(true);
      } catch (err) {
        // Expired or invalid token
        console.warn('Session verification failed, resetting auth state:', err);
        psygmaApi.clearPrivateCache();
        setIsAuthenticated(false);
        setUser(INITIAL_USER);
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    const authData = await psygmaApi.login(email, pass);
    setUser(authData.user);
    setIsAuthenticated(true);
    return true;
  };

  const loginAsDemo = async (): Promise<boolean> => {
    const authData = await psygmaApi.demoLogin();
    setUser(authData.user);
    setIsAuthenticated(true);
    return true;
  };

  const signup = async (name: string, email: string, pass: string): Promise<boolean> => {
    const authData = await psygmaApi.register(name, email, pass);
    setUser(authData.user);
    setIsAuthenticated(true);
    return true;
  };

  const logout = async () => {
    await psygmaApi.logout();
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
  };

  const updateUser = async (profile: Partial<UserProfile>) => {
    const updated = await psygmaApi.updateUserProfile(profile);
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      user,
      login,
      loginAsDemo,
      signup,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
