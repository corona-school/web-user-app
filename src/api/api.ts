import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Credentials, User, Subject } from '../types';
import { CertificateData } from '../components/Modals/CerificateModal';
import { SchoolInfo, Tutee, Tutor } from '../types/Registration';
import {
  Course,
  SubCourse,
  Lecture,
  CourseOverview,
  Tag,
} from '../types/Course';
import { apiURL, dev } from './config';
import { BecomeInstructor, BecomeIntern } from '../types/Instructor';
import { MenteeMessage, Mentoring } from '../types/Mentoring';
import { FeedbackCall } from '../types/FeedbackCall';
import {
  ApiProjectFieldInfo,
  BecomeProjectCoach,
  BecomeProjectCoachee,
} from '../types/ProjectCoach';
import { IExposedCertificate, ISupportedLanguage } from '../types/Certificate';

const logError = (apiName: string) => (error: Error) => {
  if (dev) console.error(`${apiName} failed:`, error);
  throw error;
};

/* NOTE: Maybe we can migrate more APIs to this, then this file will get slightly smaller ... */
// eslint-disable-next-line
const getAPI = <R = void, P extends Array<any> = Array<void>>(
  name: string,
  url: string | ((...params: P) => string),
  returns?: (res: AxiosResponse) => R,
  options: AxiosRequestConfig = {}
) => (token: string, ...args: P): Promise<R> =>
  axios
    .get(apiURL + (typeof url === 'string' ? url : url(...args)), {
      headers: { token },
      ...options,
    })
    .then(returns ?? ((() => {}) as () => R))
    .catch(logError(name));

export class APIError extends Error {
  constructor(public readonly code: number, message: string) {
    super(message);
  }
}

export const redeemVerificationToken = (
  verificationToken: string
): Promise<string> =>
  axios
    .post(`${apiURL}/token`, {
      token: verificationToken,
    })
    .then((response) => response.data.token)
    .catch(logError('redeemVerificationToken'));

export const getUserId = (token: string): Promise<string> =>
  axios
    .get(`${apiURL}/user`, {
      headers: { token },
    })
    .then((response) => {
      if (response.status === 200) {
        return response.data.id;
      }
      if (dev) console.error('getUserId failed:', response);
      throw new APIError(response.status, 'getUserId');
    })
    .catch(logError('getUserId'));

export const putUser = async (
  credentials: Credentials,
  user: {
    firstname?: string;
    lastname?: string;
    grade?: number;
    matchesRequested?: number;
    projectMatchesRequested?: number;
    state?: string;
    university?: string;
    schoolType?: string;
    lastUpdatedSettingsViaBlocker: number;
  }
) => {
  await axios
    .put(`${apiURL}/user/${credentials.id}`, user, {
      headers: { token: credentials.token },
    })
    .catch(logError('putUser'));
};

// ========================================================================

export const axiosGetUser = (id: string, token: string): Promise<User> => {
  return axios
    .get(`${apiURL}/user/${id}`, {
      headers: { Token: token },
    })
    .then((res) => res.data)
    .catch(logError('getUser'));
};

export const axiosDissolveMatch = async (
  id: string,
  token: string,
  uuid: string,
  reason?: number
) => {
  const url = `${apiURL}/user/${id}/matches/${uuid}`;
  await axios
    .delete(url, {
      headers: { token },
      data: reason === undefined ? undefined : { reason },
    })
    .catch(logError('dissolveMatch'));
};

export const axiosDissolveProjectMatch = async (
  id: string,
  token: string,
  uuid: string,
  reason?: number
) => {
  const url = `${apiURL}/user/${id}/projectMatches/${uuid}`;
  await axios
    .delete(url, {
      headers: { token },
      data: reason === undefined ? undefined : { reason },
    })
    .catch(logError('dissolveProjectMatch'));
};

export const axiosRequestNewToken = async (
  email: string,
  redirectTo: string
) => {
  const url = `${apiURL}/token`;
  await axios
    .get(url, {
      params: { email, redirectTo },
    })
    .catch((error) => {
      if (dev) console.error('requestNewToken failed:', error);
      throw new APIError(error?.response?.status, 'requestNewToken');
    });
};

export const axiosPutUserSubjects = async (
  id: string,
  token: string,
  subjects: Subject[]
) => {
  const url = `${apiURL}/user/${id}/subjects`;
  await axios
    .put(url, subjects, { headers: { token } })
    .catch(logError('putUserSubjects'));
};

export const axiosPutUserProjectFields = async (
  id: string,
  token: string,
  projectFields: ApiProjectFieldInfo[]
) => {
  const url = `${apiURL}/user/${id}/projectFields`;
  await axios
    .put(url, projectFields, { headers: { token } })
    .catch(logError('putUserProjectFields'));
};

export const axiosPutUserActive = async (
  id: string,
  token: string,
  active: boolean
) => {
  const url = `${apiURL}/user/${id}/active/${active ? 'true' : 'false'}`;
  console.log(url);
  await axios
    .put(url, undefined, { headers: { token } })
    .catch(logError('putUserActive'));
};

export const axiosCreateCertificate = async (
  id: string,
  token: string,
  certificateData: CertificateData
): Promise<AxiosResponse<string>> => {
  const url = `${apiURL}/certificate/create/${id}/${certificateData.student}`;

  const params = new URLSearchParams();
  params.append('subjects', certificateData.subjects.join(','));
  params.append('endDate', certificateData.endDate.toString());
  params.append('medium', certificateData.mediaType || '');
  params.append('hoursPerWeek', certificateData.hoursPerWeek.toString());
  params.append('hoursTotal', certificateData.hoursTotal.toString());
  params.append('categories', certificateData.activities.join('\n'));
  params.append('lang', certificateData.lang);
  params.append('ongoingLessons', certificateData.ongoingLessons.toString());

  return axios
    .get(url, { headers: { token }, responseType: 'blob', params })
    .catch(logError('createCertificate'));
};

export const axiosGetCertificate = getAPI(
  'getCertificate',
  (uuid: string, lang: ISupportedLanguage) =>
    `/certificate/${uuid}?lang=${lang}`,
  (res) => res.data,
  { responseType: 'blob' }
);

export const axiosGetCertificates = getAPI(
  'getCertificates',
  '/certificates',
  (res) => res.data.certificates as IExposedCertificate[]
);

export const axiosGetCourses = async (
  token: string
): Promise<CourseOverview[]> => {
  const url = `${apiURL}/courses`;

  const params = new URLSearchParams();
  params.append(
    'fields',
    'name,description,tags,outline,state,category,instructors,subcourses,cancelled,joined,joinAfterStart,image'
  );

  return axios
    .get(url, { headers: { token }, params })
    .then((response) => response.data)
    .catch(logError('getCourses'));
};

export const axiosGetCourseTags = (token: string): Promise<Tag[]> => {
  const url = `${apiURL}/courses/tags`;

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

export const axiosGetCourse = (
  token: string,
  id: string
): Promise<CourseOverview> => {
  const url = `${apiURL}/course/${id}`;

  return axios
    .get(url, { headers: { token } })
    .then((response) => response.data)
    .catch(logError('getCourse'));
};

export const axiosEditCourse = async (
  token: string,
  id: number,
  course: Course
) => {
  const url = `${apiURL}/course/${id}`;

  await axios
    .put(url, course, { headers: { token } })
    .catch(logError('editCourse'));
};

export const axiosSubmitCourse = async (
  token: string,
  id: number,
  course: Course
) => {
  const url = `${apiURL}/course/${id}`;

  await axios
    .put(url, { ...course, submit: true }, { headers: { token } })
    .catch(logError('submitCourse'));
};

export const axiosPublishSubCourse = async (
  token: string,
  courseId: number,
  id: number,
  subcourse: SubCourse
) => {
  const url = `${apiURL}/course/${courseId}/subcourse/${id}`;

  await axios
    .put(url, { ...subcourse, published: true }, { headers: { token } })
    .catch(logError('publishSubCourse'));
};

export const axiosGetMyCourses = (
  token: string,
  instructor?: string,
  participant?: string
): Promise<CourseOverview[]> => {
  const url = `${apiURL}/courses`;

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

  return axios
    .get(url, { headers: { token }, params })
    .then((response) => response.data)
    .catch(logError('getMyCourses'));
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

export const axiosRegisterTutee = (tutee: Tutee) => {
  if (!isValidTutee(tutee)) {
    throw new Error('Tutee is not valid');
  }

  return axios
    .post(`${apiURL}/register/tutee`, tutee)
    .then((response) => response.data)
    .catch(logError('registerTutee'));
};

export const axiosRegisterStateTutee = (tutee: Tutee) => {
  if (!isValidTutee(tutee)) {
    throw new Error('Tutee is not valid');
  }

  return axios
    .post(`${apiURL}/register/tutee/state`, tutee)
    .then((response) => response.data)
    .catch(logError('registerStateTutee'));
};

export const axiosRegisterTutor = (tutor: Tutor) => {
  if (!isValidTutor(tutor)) {
    throw new Error('Tutor is not valid');
  }

  return axios
    .post(`${apiURL}/register/tutor`, tutor)
    .then((response) => response.data)
    .catch(logError('registerTutor'));
};

export const axiosCreateCourse = (token: string, course: Course) => {
  return axios
    .post(`${apiURL}/course`, course, { headers: { token } })
    .then((response) => response.data.id)
    .catch(logError('createCourse'));
};

export const axiosJoinCourse = async (
  token: string,
  courseId: number,
  subCourseId: number,
  participant: string
) => {
  await axios
    .post(
      `${apiURL}/course/${courseId}/subcourse/${subCourseId}/participants/${participant}`,
      {},
      { headers: { token } }
    )
    .catch(logError('joinCourse'));
};

export const axiosLeaveCourse = async (
  token: string,
  courseId: number,
  subCourseId: number,
  participant: string
) => {
  await axios
    .delete(
      `${apiURL}/course/${courseId}/subcourse/${subCourseId}/participants/${participant}`,
      { headers: { token } }
    )
    .catch(logError('leaveCourse'));
};

export const axiosCancelCourse = async (token: string, courseId: number) => {
  await axios
    .delete(`${apiURL}/course/${courseId}`, { headers: { token } })
    .catch(logError('cancelCourse'));
};

export const axiosCreateSubCourse = (
  token: string,
  courseId: number,
  subCourse: SubCourse
): Promise<number> => {
  console.log(subCourse);

  return axios
    .post(`${apiURL}/course/${courseId}/subcourse`, subCourse, {
      headers: { token },
    })
    .then((response) => response.data.id)
    .catch(logError('createSubcourse'));
};

export const axiosCancelSubCourse = async (
  token: string,
  courseId: number,
  subCourseId: number
) => {
  await axios
    .delete(`${apiURL}/course/${courseId}/subcourse/${subCourseId}`, {
      headers: { token },
    })
    .catch(logError('cancelSubcourse'));
};

export const axiosEditSubCourse = async (
  token: string,
  courseId: number,
  subCourseId: number,
  subCourse: SubCourse
) => {
  await axios
    .put(`${apiURL}/course/${courseId}/subcourse/${subCourseId}`, subCourse, {
      headers: { token },
    })
    .catch(logError('editSubcourse'));
};

export const axiosCreateLecture = (
  token: string,
  courseId: number,
  subCourseId: number,
  lecture: Lecture
): Promise<number> => {
  return axios
    .post(
      `${apiURL}/course/${courseId}/subcourse/${subCourseId}/lecture`,
      lecture,
      {
        headers: { token },
      }
    )
    .then((response) => response.data.id)
    .catch(logError('createLecture'));
};

export const axiosEditLecture = (
  token: string,
  courseId: number,
  subCourseId: number,
  lectureId: number,
  lecture: Lecture
): Promise<number> => {
  return axios
    .put(
      `${apiURL}/course/${courseId}/subcourse/${subCourseId}/lecture/${lectureId}`,
      lecture,
      {
        headers: { token },
      }
    )
    .then((response) => response.data.id)
    .catch(logError('editLecture'));
};

export const axiosCancelLecture = async (
  token: string,
  courseId: number,
  subCourseId: number,
  lectureId: number
) => {
  await axios
    .delete(
      `${apiURL}/course/${courseId}/subcourse/${subCourseId}/lecture/${lectureId}`,
      { headers: { token } }
    )
    .catch(logError('cancelLecture'));
};

export const axiosSendCourseGroupMail = async (
  token: string,
  courseId: number,
  subCourseId: number,
  subject: string,
  body: string
) => {
  await axios
    .post(
      `${apiURL}/course/${courseId}/subcourse/${subCourseId}/groupmail`,
      { subject, body },
      {
        headers: { token },
      }
    )
    .catch(logError('sendGroupcourseMail'));
};

export const axiosBecomeInstructor = async (
  id: string,
  token: string,
  data: BecomeInstructor | BecomeIntern
) => {
  await axios
    .post(
      `${apiURL}/user/${id}/role/instructor`,
      { ...data },
      {
        headers: { token },
      }
    )
    .catch(logError('becomeInstructor'));
};

export const axiosJoinBBBmeeting = (
  token: string,
  courseId: number,
  subcourseId: number
): Promise<CourseOverview> => {
  const url = `${apiURL}/course/${courseId}/subcourse/${subcourseId}/meeting/join`;

  return axios
    .get(url, { headers: { token } })
    .then((response) => {
      console.log(response);
      return response.data;
    })
    .catch(logError('JoinBBBmeeting'));
};

export const axiosGetCooperatingSchool = (
  state: string
): Promise<SchoolInfo[]> => {
  const url = `${apiURL}/register/${state}/schools`;

  return axios
    .get(url)
    .then((response) => response.data)
    .catch(logError('getCooperatingSchool'));
};

export const axiosGetMentoringMaterial = (
  token: string,
  type: string,
  location: string
): Promise<Mentoring[]> => {
  const url = `${apiURL}/mentoring/material`;

  const params = new URLSearchParams();
  params.append('type', type);
  params.append('location', location);

  return axios
    .get(url, { headers: { token }, params })
    .then((response) => response.data)
    .catch(logError('getMentoringMaterial'));
};

export const axiosGetFeedbackCallData = (
  token: string
): Promise<FeedbackCall> => {
  return axios
    .get(`${apiURL}/mentoring/feedbackCall`, { headers: { token } })
    .then((response) => response.data)
    .catch(logError('getFeedbackCallData'));
};

export const axiosPostContactMentor = async (
  token: string,
  message: MenteeMessage
) => {
  await axios
    .post(`${apiURL}/mentoring/contact`, message, { headers: { token } })
    .catch(logError('postContactMentor'));
};

export const axiosPostUserRoleProjectCoach = async (
  token: string,
  id: string,
  projectCoachData: BecomeProjectCoach
) => {
  await axios
    .post(`${apiURL}/user/${id}/role/projectCoach`, projectCoachData, {
      headers: { token },
    })
    .catch(logError('becomeProjectCoach'));
};

export const axiosPostUserRoleProjectCoachee = async (
  token: string,
  id: string,
  projectCoacheeData: BecomeProjectCoachee
) => {
  await axios
    .post(`${apiURL}/user/${id}/role/projectCoachee`, projectCoacheeData, {
      headers: { token },
    })
    .catch(logError('becomeProjectCoachee'));
};

export const axiosAddInstructor = (
  token: string,
  courseId: number,
  email: string
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    axios
      .post(
        `${apiURL}/course/${courseId}/instructor`,
        { email },
        {
          headers: { token },
        }
      )
      .then(() => resolve())
      .catch((err) => {
        console.log(`Caught error: ${err}`);
        reject(err);
      });
  });
};

export const axiosDeleteCourseImage = async (
  token: string,
  courseID: number
) => {
  const url = `${apiURL}/course/${courseID}/image`;
  await axios
    .delete(url, {
      headers: { token },
    })
    .catch(logError('deleteCourseImage'));
};

// ========================================================================
export const editCourseImageURL = (courseID: number) =>
  `${apiURL}/course/${courseID}/image`;
