import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { User, Subject, CourseOverview } from '../types';
import * as api from '../api/api';
import { AxiosResponse } from 'axios';
import { CertificateData } from '../components/Modals/CerificateModal';

export const ApiContext = React.createContext<{
  getUserData: () => Promise<any>;
  dissolveMatch: (uuid: string, reason?: number) => Promise<void>;
  requestNewToken: (email: string) => Promise<void>;
  putUserSubjects: (subjects: Subject[]) => Promise<void>;
  putUserActiveFalse: () => Promise<void>;
  getCertificate: (
    cerfiticateData: CertificateData
  ) => Promise<AxiosResponse<any>>;
  getCourses: () => Promise<CourseOverview[]>;
}>({
  getUserData: () => Promise.reject(),
  dissolveMatch: (uuid, reason?) => Promise.reject(),
  requestNewToken: api.axiosRequestNewToken,
  putUserSubjects: (subjects) => Promise.reject(),
  putUserActiveFalse: () => Promise.reject(),
  getCertificate: (cerfiticateData) => Promise.reject(),
  getCourses: () => Promise.reject(),
});

export const ApiProvider: React.FC = ({ children }) => {
  const authContext = useContext(AuthContext);

  const {
    credentials: { id, token },
  } = authContext;

  const getUserData = (): Promise<User> => api.axiosGetUser(id, token);

  const dissolveMatch = (uuid: string, reason?: number): Promise<void> =>
    api.axiosDissolveMatch(id, token, uuid, reason);

  const putUserSubjects = (subjects: Subject[]): Promise<void> =>
    api.axiosPutUserSubjects(id, token, subjects);

  const putUserActiveFalse = (): Promise<void> =>
    api.axiosPutUserActive(id, token, false);

  const getCertificate = (
    certificateDate: CertificateData
  ): Promise<AxiosResponse<any>> =>
    api.axiosGetCertificate(id, token, certificateDate);

  const getCourses = (): Promise<CourseOverview[]> =>
    api.axiosGetCourses(token);

  return (
    <ApiContext.Provider
      value={{
        getUserData,
        dissolveMatch,
        requestNewToken: api.axiosRequestNewToken,
        putUserSubjects,
        putUserActiveFalse,
        getCertificate,
        getCourses,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
