import React, { createContext, useContext } from 'react';
import { User } from '@/types/auth';

interface UserContextType {
  user: User | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<UserContextType & { children: React.ReactNode }> = ({ children, user }) => {
  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
};
