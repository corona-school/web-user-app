import axios, { AxiosResponse } from 'axios';
import { Credentials, User, Subject } from '../types';
import { CertificateData } from '../components/Modals/CerificateModal';
import { Tutee, Tutor } from '../types/Registration';
import { Course, SubCourse, Lecture, CourseOverview } from '../types/Course';
import { apiURL, dev } from './config';
import { BecomeInstructor, BecomeIntern } from '../types/Instructor';

export const redeemVerificationToken = (
  verificationToken: string
): Promise<string> =>
  new Promise((resolve, reject) => {
    axios
      .post(`${apiURL}/token`, {
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
      .get(`${apiURL}/user`, {
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
    state?: string;
    university?: string;
    schoolType?: string;
    lastUpdatedSettingsViaBlocker: number;
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
  return new Promise((resolve, reject) =>
    axios
      .get(`${apiURL}/user/${id}`, {
        headers: { Token: token },
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err))
  );
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

export const axiosRequestNewToken = (
  email: string,
  redirectTo: string
): Promise<void> => {
  const url = `${apiURL}/token`;
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: { email, redirectTo },
      })
      .then(() => resolve())
      .catch((error) => {
        reject(error?.response?.status);
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<AxiosResponse<any>> => {
  const url = `${apiURL}/certificate/${id}/${certificateDate.student}`;

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
    params.append(
      'fields',
      'name,description,tags,outline,state,category,instructors,subcourses,cancelled,joined,joinAfterStart'
    );

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

export const axiosGetCourse = (
  token: string,
  id: string
): Promise<CourseOverview> => {
  const url = `${apiURL}/course/${id}`;

  return new Promise((resolve, reject) => {
    axios
      .get(url, { headers: { token } })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const axiosEditCourse = (
  token: string,
  id: number,
  course: Course
): Promise<void> => {
  const url = `${apiURL}/course/${id}`;

  return new Promise((resolve, reject) => {
    axios
      .put(url, course, { headers: { token } })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const axiosSubmitCourse = (
  token: string,
  id: number,
  course: Course
): Promise<void> => {
  const url = `${apiURL}/course/${id}`;

  return new Promise((resolve, reject) => {
    axios
      .put(url, { ...course, submit: true }, { headers: { token } })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const axiosPublishSubCourse = (
  token: string,
  courseId: number,
  id: number,
  subcourse: SubCourse
): Promise<void> => {
  const url = `${apiURL}/course/${courseId}/subcourse/${id}`;

  return new Promise((resolve, reject) => {
    axios
      .put(url, { ...subcourse, published: true }, { headers: { token } })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const axiosGetMyCourses = (
  token: string,
  instructor?: string,
  participant?: string
): Promise<CourseOverview[]> => {
  const url = `${apiURL}/courses`;

  return new Promise((resolve, reject) => {
    const params = new URLSearchParams();
    params.append(
      'fields',
      'name,description,tags,outline,state,category,instructors,subcourses,cancelled,joined,joinAfterStart'
    );
    if (instructor) {
      params.append('instructor', instructor);
      params.append('states', 'created,submitted,allowed,denied,cancelled');
    }
    if (participant) {
      params.append('participant', participant);
    }

    params.append('onlyJoinableCourses', 'false');

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

export const axiosJoinCourse = (
  token: string,
  courseId: number,
  subCourseId: number,
  participant: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${apiURL}/course/${courseId}/subcourse/${subCourseId}/participants/${participant}`,
        {},
        { headers: { token } }
      )
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const axiosLeaveCourse = (
  token: string,
  courseId: number,
  subCourseId: number,
  participant: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    axios
      .delete(
        `${apiURL}/course/${courseId}/subcourse/${subCourseId}/participants/${participant}`,
        { headers: { token } }
      )
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const axiosCancelCourse = (
  token: string,
  courseId: number
): Promise<void> => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${apiURL}/course/${courseId}`, { headers: { token } })
      .then(() => {
        resolve();
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
  return new Promise((resolve, reject) => {
    console.log(subCourse);

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

export const axiosCancelSubCourse = (
  token: string,
  courseId: number,
  subCourseId: number
): Promise<void> => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${apiURL}/course/${courseId}/subcourse/${subCourseId}`, {
        headers: { token },
      })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const axiosEditSubCourse = (
  token: string,
  courseId: number,
  subCourseId: number,
  subCourse: SubCourse
): Promise<void> => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${apiURL}/course/${courseId}/subcourse/${subCourseId}`, subCourse, {
        headers: { token },
      })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const axiosCreateLecture = (
  token: string,
  courseId: number,
  subCourseId: number,
  lecture: Lecture
): Promise<number> => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${apiURL}/course/${courseId}/subcourse/${subCourseId}/lecture`,
        lecture,
        {
          headers: { token },
        }
      )
      .then((response) => {
        resolve(response.data.id);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const axiosEditLecture = (
  token: string,
  courseId: number,
  subCourseId: number,
  lectureId: number,
  lecture: Lecture
): Promise<number> => {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `${apiURL}/course/${courseId}/subcourse/${subCourseId}/lecture/${lectureId}`,
        lecture,
        {
          headers: { token },
        }
      )
      .then((response) => {
        resolve(response.data.id);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const axiosCancelLecture = (
  token: string,
  courseId: number,
  subCourseId: number,
  lectureId: number
): Promise<void> => {
  return new Promise((resolve, reject) => {
    axios
      .delete(
        `${apiURL}/course/${courseId}/subcourse/${subCourseId}/lecture/${lectureId}`,
        { headers: { token } }
      )
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const axiosSendCourseGroupMail = (
  token: string,
  courseId: number,
  subCourseId: number,
  subject: string,
  body: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${apiURL}/course/${courseId}/subcourse/${subCourseId}/groupmail`,
        { subject, body },
        {
          headers: { token },
        }
      )
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const axiosBecomeInstructor = (
  id: string,
  token: string,
  data: BecomeInstructor | BecomeIntern
): Promise<void> => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${apiURL}/user/${id}/role/instructor`,
        { ...data },
        {
          headers: { token },
        }
      )
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const axiosJoinBBBmeeting = (
  token: string,
  courseId: number,
  subcourseId: number
): Promise<CourseOverview> => {
  const url = `${apiURL}/course/${courseId}/meeting/join`;

  return new Promise((resolve, reject) => {
    axios
      .post(url, { subcourseId }, { headers: { token } })
      .then((response) => {
        console.log(response);
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
