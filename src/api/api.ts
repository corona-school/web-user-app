import axios, { AxiosResponse } from 'axios';
import { Credentials, User, Subject } from '../types';
import { CertificateData } from '../components/Modals/CerificateModal';

const dev = process.env.NODE_ENV === 'development';

const apiURL = dev
  ? 'http://localhost:5000/api'
  : `https://api.corona-school.de/api`;

export const redeemVerificationToken = (
  verificationToken: string
): Promise<string> =>
  new Promise((resolve, reject) => {
    axios
      .post(apiURL + '/token', {
        token: verificationToken,
      })
      .then((response) => resolve(response.data.token))
      .catch((reason) => {
        reject(reason);
        if (dev) console.error('redeemVerificationToken failed:', reason);
      });
  });

export const getUserId = (token: string): Promise<string> =>
  new Promise((resolve, reject) => {
    axios
      .get(apiURL + '/user', {
        headers: { token },
      })
      .then((response) => {
        if (response.status === 200) {
          resolve(response.data.id);
        } else {
          reject(response);
          if (dev) console.error('getUserId failed:', response);
        }
      })
      .catch((reason) => {
        reject(reason);
        if (dev) console.error('getUserId failed:', reason);
      });
  });

export const putUser = (
  credentials: Credentials,
  user: {
    firstname?: string;
    lastname?: string;
    grade?: number;
    matchesRequested?: number;
  }
): Promise<void> =>
  new Promise((resolve, reject) => {
    axios
      .put(`${apiURL}/user/${credentials.id}`, user, {
        headers: { token: credentials.token },
      })
      .then(() => resolve())
      .catch((reason) => {
        reject(reason);
        if (dev) console.error('putUser failed:', reason);
      });
  });

// ========================================================================

export const axiosGetUser = (id: string, token: string): Promise<User> => {
  return axios.get(`${apiURL}/user/${id}`, {
    headers: { Token: token },
  });
};

export const axiosDissolveMatch = (
  id: string,
  token: string,
  uuid: string,
  reason?: number
): Promise<void> => {
  const url = `${apiURL}/user/${id}/matches/${uuid}`;
  return new Promise((resolve, reject) => {
    axios
      .delete(url, {
        headers: { token },
        data: reason === undefined ? undefined : { reason },
      })
      .then(() => resolve())
      .catch((error) => {
        reject();
        if (dev) console.error('dissolveMatch failed:', error);
      });
  });
};

export const axiosRequestNewToken = (email: string): Promise<void> => {
  const url = `${apiURL}/token`;
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: { email },
      })
      .then(() => resolve())
      .catch((error) => {
        reject();
        if (dev) console.error('requestNewToken failed:', error);
      });
  });
};

export const axiosPutUserSubjects = (
  id: string,
  token: string,
  subjects: Subject[]
): Promise<void> => {
  const url = `${apiURL}/user/${id}/subjects`;
  return new Promise((resolve, reject) => {
    axios
      .put(url, subjects, { headers: { token } })
      .then(() => resolve())
      .catch((error) => {
        reject();
        if (dev) console.error('putUserSubjects failed:', error);
      });
  });
};

export const axiosPutUserActive = (
  id: string,
  token: string,
  active: boolean
): Promise<void> => {
  const url = `${apiURL}/user/${id}/active/${active ? 'true' : 'false'}`;
  console.log(url);
  return new Promise((resolve, reject) => {
    axios
      .put(url, undefined, { headers: { token } })
      .then(() => resolve())
      .catch((error) => {
        reject();
        if (dev) console.error('putUserActive failed:', error);
      });
  });
};

export const axiosGetCertificate = (
  id: string,
  token: string,
  certificateDate: CertificateData
): Promise<AxiosResponse<any>> => {
  const url = `${apiURL}/certificate/${id}/00000000-0000-0001-0002-1b4c4c526364`;
  console.log(url);
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams();
    params.append('subjects', certificateDate.subjects.join(','));
    params.append('endDate', certificateDate.endDate.toString());
    params.append('hoursPerWeek', certificateDate.hoursPerWeek.toString());
    params.append('hoursTotal', (certificateDate.hoursPerWeek * 3).toString());
    params.append(
      'categories',
      certificateDate.activities.map((c) => c.text).join('\n')
    );
    axios
      .get(url, { headers: { token }, responseType: 'blob', params })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        console.log('getCertificate failed:', error);
        reject();
      });
  });
};
