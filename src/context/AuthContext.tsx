import React, { useState, useEffect } from 'react';
import { Credentials, AuthStatusOptions } from '../types';

const dev = process.env.NODE_ENV === 'development';

const readStoredCredentials = (): { id: string; token: string } | null => {
  try {
    const unsafe = window.localStorage.getItem('credentials');
    if (unsafe === null) return null;
    const safe = unsafe.replace(/[^a-zA-Z0-9{":,}_-]/g, '');
    const parsed = JSON.parse(safe);
    if (parsed && parsed.id && parsed.token) return parsed;
    else return null;
  } catch (error) {
    // TODO: maybe warn user to use a newer browser; maybe check beforehand with "typeof Storage"
    if (dev) console.error('could not write credentials', error);
    return null;
  }
};

const writeStoredCredentials = (credentials: {
  id: string;
  token: string;
}): void => {
  try {
    window.localStorage.setItem('credentials', JSON.stringify(credentials));
  } catch (error) {
    if (dev) console.error('could not write credentials', error);
  }
};

const deleteStoredCredentials = (): void => {
  try {
    window.localStorage.removeItem('credentials');
  } catch (error) {
    if (dev) console.error('could not delete credentials', error);
  }
};

export const AuthContext = React.createContext<{
  credentials: Credentials;
  setCredentials: (credentials: Credentials) => void;
  status: 'pending' | 'missing' | 'authorized' | 'invalid';
  setStatus: (
    pending: 'pending' | 'missing' | 'authorized' | 'invalid'
  ) => void;
  writeStoredCredentials: (credentials: { id: string; token: string }) => void;
  deleteStoredCredentials: () => void;
}>({
  credentials: { id: '', token: '' },
  setCredentials: (credentials) => {},
  status: 'pending',
  setStatus: (pending) => {},
  writeStoredCredentials: (credentials) => {},
  deleteStoredCredentials: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [credentials, setCredentials] = useState({ id: '', token: '' });
  const [status, setStatus] = useState<AuthStatusOptions>('pending');

  useEffect(() => {
    const stored = readStoredCredentials();
    if (stored) {
      setCredentials(stored);
    } else setStatus('missing');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        credentials,
        setCredentials,
        status,
        setStatus,
        writeStoredCredentials,
        deleteStoredCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
