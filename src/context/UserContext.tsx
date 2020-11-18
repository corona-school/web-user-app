import React, { useState, useEffect, useContext } from 'react';
import { message } from 'antd';
import { User, ScreeningStatus } from '../types';
import storedCredentials from '../api/storedCredentials';
import { AuthContext } from './AuthContext';
import { ApiContext } from './ApiContext';

export const defaultUser = {
  id: 'defaultId',
  firstname: 'defaultFirstname',
  lastname: 'defaultLastname',
  email: 'defaultEmail',
  active: true,
  type: 'student' as const,
  matchesRequested: 0,
  screeningStatus: ScreeningStatus.Accepted,
  instructorScreeningStatus: ScreeningStatus.Accepted,
  projectCoachingScreeningStatus: ScreeningStatus.Accepted,
  lastUpdatedSettingsViaBlocker: null,
  registrationDate: null,
  matches: [
    {
      firstname: 'defaultPupilFirstname',
      lastname: 'defaultPupilLastname',
      email: 'defaultEmail',
      subjects: ['Mathe', 'Deutsch', 'Englisch'],
      uuid: 'defaultUuid',
      jitsilink: 'defaultJitsilink',
      date: 120301923,
    },
  ],
  dissolvedMatches: [
    {
      firstname: 'defaultPupilFirstname',
      lastname: 'defaultPupilLastname',
      email: 'defaultEmail',
      subjects: ['Mathe', 'Deutsch', 'Englisch'],
      uuid: 'defaultUuid',
      jitsilink: 'defaultJitsilink',
      date: 120301923,
    },
  ],
  projectMatches: [],
  subjects: [
    {
      name: 'Mathematik' as const,
      minGrade: 1,
      maxGrade: 12,
    },
  ],
};

export const UserContext = React.createContext<{
  user: User;
  fetchUserData: () => void;
}>({
  user: defaultUser,
  fetchUserData: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>(defaultUser);

  const authContext = useContext(AuthContext);
  const apiContext = useContext(ApiContext);

  const fetchUserData = () => {
    if (authContext.credentials.id && authContext.credentials.token) {
      apiContext
        .getUserData()
        .then((response) => {
          setUser(response);
          authContext.setStatus('authorized');
        })
        .catch((error) => {
          message.error('Du konntest nicht eingeloggt werden.');
          authContext.setStatus('invalid');
          if (error && error.response && error.response.status === 403) {
            authContext.setCredentials({ id: '', token: '' });
            storedCredentials.delete();
          }
        });
    } else {
      setUser(defaultUser);
    }
  };

  useEffect(fetchUserData, [authContext.credentials]);

  return (
    <UserContext.Provider value={{ user, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};
