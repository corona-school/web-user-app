import axios, { AxiosResponse } from 'axios';
import { Credentials, User, Subject, CourseOverview } from '../types';
import { CertificateData } from '../components/Modals/CerificateModal';
import { Tutee, Tutor } from '../types/Registration';
import { Course, SubCourse } from '../types/Course';

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
  const url = `${apiURL}/certificate/${id}/${certificateDate.student}`;
  console.log(url);
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams();
    params.append('subjects', certificateDate.subjects.join(','));
    params.append('endDate', certificateDate.endDate.toString());
    params.append('medium', certificateDate.mediaType || '');
    params.append('hoursPerWeek', certificateDate.hoursPerWeek.toString());
    params.append('hoursTotal', certificateDate.hoursTotal.toString());
    params.append('categories', certificateDate.activities.join('\n'));
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

export const axiosGetCourses = (token: string): Promise<CourseOverview[]> => {
  const url = `${apiURL}/courses`;

  return new Promise((resolve, reject) => {
    const params = new URLSearchParams();
    params.append('fields', 'name,outline,category,startDate,instructor');

    axios
      .get(url, { headers: { token }, params })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const isValidTutee = (tutee: Tutee) => {
  if (tutee.isTutee) {
    return tutee.subjects !== undefined;
  }
  return true;
};

const isValidTutor = (tutor: Tutor) => {
  if (tutor.isTutor) {
    if (!tutor.subjects) {
      return false;
    }
  }
  if (tutor.isOfficial) {
    if (!tutor.university) {
      return false;
    }
    if (!tutor.module) {
      return false;
    }
    if (!tutor.hours) {
      return false;
    }
  }
  return true;
};

export const axiosRegisterTutee = (tutee: Tutee): Promise<void> => {
  if (!isValidTutee(tutee)) {
    throw new Error('Tutee is not valid');
  }

  return new Promise((resolve, reject) => {
    axios
      .post(`${apiURL}/register/tutee`, tutee)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const axiosRegisterTutor = (tutor: Tutor): Promise<void> => {
  if (!isValidTutor(tutor)) {
    throw new Error('Tutor is not valid');
  }

  return new Promise((resolve, reject) => {
    axios
      .post(`${apiURL}/register/tutor`, tutor)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const axiosCreateCourse = (
  token: string,
  course: Course
): Promise<number> => {
  console.log(course);

  return new Promise((resolve, reject) => {
    axios
      .post(`${apiURL}/course`, course, { headers: { token } })
      .then((response) => {
        resolve(response.data.id);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const axiosCreateSubCourse = (
  token: string,
  courseId: number,
  subCourse: SubCourse
): Promise<number> => {
  console.log(subCourse);

  return new Promise((resolve, reject) => {
    axios
      .post(`${apiURL}/course/${courseId}/subcourse`, subCourse, {
        headers: { token },
      })
      .then((response) => {
        resolve(response.data.id);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
