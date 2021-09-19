import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { User, Subject, BecomeTutor } from '../types';
import * as api from '../api/api';
import { CertificateData } from '../components/Modals/CerificateModal';
import { SchoolInfo, Tutee, Tutor } from '../types/Registration';
import {
  Course,
  SubCourse,
  Lecture,
  CourseOverview,
  Tag,
  Participant,
  CourseParticipant,
} from '../types/Course';
import { BecomeInstructor, BecomeIntern } from '../types/Instructor';
import { CompletedSubCourse } from '../components/forms/CreateCourse';
import { CompletedLecture } from '../routes/CourseForm';
import { MenteeMessage, Mentoring } from '../types/Mentoring';
import { FeedbackCall } from '../types/FeedbackCall';
import {
  ApiProjectFieldInfo,
  BecomeProjectCoach,
  BecomeProjectCoachee,
} from '../types/ProjectCoach';
import { Expert, ExpertTag, ExpertUpdate } from '../types/Expert';
import { IExposedCertificate, ISupportedLanguage } from '../types/Certificate';

interface IApiContext {
  getUserData: () => Promise<User>;
  dissolveMatch: (uuid: string, reason?: number) => Promise<void>;
  dissolveProjectMatch: (uuid: string, reason?: number) => Promise<void>;
  requestNewToken: (email: string, redirectTo: string) => Promise<void>;
  putUser: (user: User) => Promise<void>;
  postUserRoleTutor: (tutorData: BecomeTutor) => Promise<void>;
  putUserSubjects: (subjects: Subject[]) => Promise<void>;
  putUserProjectFields: (projectFields: ApiProjectFieldInfo[]) => Promise<void>;
  becomeInstructor: (data: BecomeInstructor | BecomeIntern) => Promise<void>;
  putUserActiveFalse: (reason: string, feedback: string) => Promise<void>;
  createCertificate: (
    cerfiticateData: CertificateData
  ) => Promise<{ uuid: string; automatic: boolean }>;
  getCertificate: (
    uuid: IExposedCertificate['uuid'],
    lang: ISupportedLanguage
  ) => Promise<string>;
  getCertificates: () => Promise<IExposedCertificate[]>;
  signCertificate: (
    uuid: string,
    body: {
      signaturePupil?: string;
      signatureParent?: string;
      signatureLocation: string;
    }
  ) => Promise<boolean>;
  getCourses: () => Promise<CourseOverview[]>;
  getCourseTags: () => Promise<Tag[]>;
  getCourse: (id: string) => Promise<CourseOverview>;
  getMyCourses: (type: 'student' | 'pupil') => Promise<CourseOverview[]>;
  createCourse: (coure: Course) => Promise<number>;
  cancelCourse: (courseId: number) => Promise<void>;
  editCourse: (id: number, course: Course) => Promise<void>;
  joinCourse: (
    courseId: number,
    subCourseId: number,
    participantId: string
  ) => Promise<void>;
  leaveCourse: (
    courseId: number,
    subCourseId: number,
    participantId: string
  ) => Promise<void>;
  joinCourseWaitingList: (
    courseId: number,
    subCourseId: number,
    participantId: string
  ) => Promise<void>;
  leaveCourseWaitingList: (
    courseId: number,
    subCourseId: number,
    participantId: string
  ) => Promise<void>;
  submitCourse: (id: number, course: Course) => Promise<void>;
  publishSubCourse: (
    courseId: number,
    id: number,
    subcourse: SubCourse
  ) => Promise<void>;
  createSubCourse: (courseId: number, subCoure: SubCourse) => Promise<number>;
  cancelSubCourse: (courseId: number, subCoureId: number) => Promise<void>;
  editSubCourse: (
    courseId: number,
    subCourse: CompletedSubCourse
  ) => Promise<void>;
  createLecture: (
    courseId: number,
    subCourseId: number,
    lecture: Lecture
  ) => Promise<number>;
  editLecture: (
    courseId: number,
    subCourseId: number,
    lecture: CompletedLecture
  ) => Promise<number>;
  cancelLecture: (
    courseId: number,
    subCourseId: number,
    lectureId: number
  ) => Promise<void>;
  registerTutee: (tutee: Tutee) => Promise<void>;
  registerStateTutee: (tutee: Tutee) => Promise<void>;
  checkEmail: (email: string) => Promise<void>;
  registerTutor: (tutor: Tutor) => Promise<void>;
  editInterestConfirmationStatus: (
    token: string,
    status: string
  ) => Promise<void>;
  sendCourseGroupMail: (
    courseId: number,
    subCourseId: number,
    subject: string,
    body: string,
    addressees: Participant[]
  ) => Promise<void>;
  issueCourseCertificates: (
    courseId: number,
    subCourseId: number,
    pupilUUIDs: string[]
  ) => Promise<void>;
  sendCourseInstructorMail: (
    courseId: number,
    subCourseId: number,
    subject: string,
    body: string
  ) => Promise<void>;
  joinBBBmeeting: (
    courseId: number,
    subcourseId: number
  ) => Promise<CourseOverview>;
  guestJoinBBBmeeting: (token: string) => Promise<{ url: string }>;
  getCooperatingSchools: (state: string) => Promise<SchoolInfo[]>;
  getMentoringMaterial: (
    type: string,
    location: string
  ) => Promise<Mentoring[]>;
  getFeedbackCallData: () => Promise<FeedbackCall>;
  postContactMentor: (message: MenteeMessage) => Promise<void>;
  postUserRoleProjectCoach: (
    projectCoachData: BecomeProjectCoach
  ) => Promise<void>;
  postUserRoleProjectCoachee: (
    projectCoacheeData: BecomeProjectCoachee
  ) => Promise<void>;
  addInstructor: (courseId: number, email: string) => Promise<void>;
  inviteCourseGuest: (
    courseID: number,
    email: string,
    firstname: string,
    lastname: string
  ) => Promise<void>;
  deleteCourseImage: (courseID: number) => Promise<void>;
  getJufoExperts: () => Promise<Expert[]>;
  getUsedExpertTags: () => Promise<ExpertTag[]>;
  contactJufoExpert: (
    id: string,
    emailText: string,
    subject: string
  ) => Promise<void>;
  updateJufoExpert: (id: string, data: ExpertUpdate) => Promise<void>;
}

const reject = () => Promise.reject();

export const ApiContext = React.createContext<IApiContext>({
  checkEmail: reject,
  getUserData: reject,
  dissolveMatch: reject,
  dissolveProjectMatch: reject,
  requestNewToken: api.axiosRequestNewToken,
  getJufoExperts: reject,
  getUsedExpertTags: reject,
  contactJufoExpert: reject,
  updateJufoExpert: reject,
  putUser: reject,
  postUserRoleTutor: reject,
  putUserSubjects: reject,
  putUserProjectFields: reject,
  becomeInstructor: reject,
  putUserActiveFalse: reject,
  createCertificate: reject,
  getCertificate: reject,
  getCertificates: reject,
  signCertificate: reject,
  getCourses: reject,
  getCourseTags: reject,
  getCourse: reject,
  getMyCourses: reject,
  createCourse: reject,
  cancelCourse: reject,
  editCourse: reject,
  joinCourse: reject,
  leaveCourse: reject,
  joinCourseWaitingList: reject,
  leaveCourseWaitingList: reject,
  submitCourse: reject,
  publishSubCourse: reject,
  createSubCourse: reject,
  editSubCourse: reject,
  cancelSubCourse: reject,
  createLecture: reject,
  editLecture: reject,
  cancelLecture: reject,
  registerTutee: reject,
  registerStateTutee: reject,
  registerTutor: reject,
  editInterestConfirmationStatus: reject,
  sendCourseGroupMail: reject,
  issueCourseCertificates: reject,
  sendCourseInstructorMail: reject,
  joinBBBmeeting: reject,
  guestJoinBBBmeeting: reject,
  getCooperatingSchools: reject,
  getMentoringMaterial: reject,
  getFeedbackCallData: reject,
  postContactMentor: reject,
  postUserRoleProjectCoach: reject,
  postUserRoleProjectCoachee: reject,
  addInstructor: reject,
  inviteCourseGuest: reject,
  deleteCourseImage: reject,
});

export function useAPI<N extends keyof IApiContext>(name: N): IApiContext[N] {
  return useContext(ApiContext)[name];
}

export function useAPIResult<N extends keyof IApiContext>(name: N) {
  const [value, setValue] = useState<{
    loading?: boolean;
    error?: Error;
    value?: ReturnType<IApiContext[N]> extends Promise<infer T> ? T : never;
  }>({ loading: true });
  const api = useAPI(name);

  function reload() {
    // eslint-disable-next-line
    (api as any)()
      .then((value) => setValue({ value }))
      .catch((error) => setValue({ error }));
  }

  useEffect(() => {
    reload();
  }, []);

  return [value, reload] as const;
}

export function useAPICallable<N extends keyof IApiContext>(name: N) {
  const [value, setValue] = useState<{
    pending?: boolean;
    loading?: boolean;
    error?: Error;
    value?: ReturnType<IApiContext[N]> extends Promise<infer T> ? T : never;
  }>({ pending: true });
  const api = useAPI(name);

  function doCall(...params: Parameters<IApiContext[N]>) {
    setValue({ loading: true });
    // eslint-disable-next-line
    (api as any)(...params)
      .then((value) => setValue({ value }))
      .catch((error) => setValue({ error }));
  }

  function reset() {
    setValue({ pending: true });
  }

  return [value, doCall, reset] as const;
}

export const ApiProvider: React.FC = ({ children }) => {
  const authContext = useContext(AuthContext);

  const {
    credentials: { id, token },
  } = authContext;

  /* NOTE: Maybe we can migrate more APIs to this, then this file will get slightly smaller ... */
  // eslint-disable-next-line
  const withToken = <R, P extends Array<any>>(
    api: (token: string, ...params: P) => R
  ) => (...args: P): R => api(token, ...args);

  const getUserData = (): Promise<User> => api.axiosGetUser(id, token);

  const dissolveMatch = (uuid: string, reason?: number): Promise<void> =>
    api.axiosDissolveMatch(id, token, uuid, reason);

  const dissolveProjectMatch = (uuid: string, reason?: number): Promise<void> =>
    api.axiosDissolveProjectMatch(id, token, uuid, reason);

  const putUser = (user: User): Promise<void> =>
    api.putUser({ id, token }, user);

  const postUserRoleTutor = (tutorData: BecomeTutor): Promise<void> =>
    api.axiosPostUserRoleTutor(id, token, tutorData);

  const putUserSubjects = (subjects: Subject[]): Promise<void> =>
    api.axiosPutUserSubjects(id, token, subjects);

  const putUserProjectFields = (
    projectFields: ApiProjectFieldInfo[]
  ): Promise<void> => api.axiosPutUserProjectFields(id, token, projectFields);

  const becomeInstructor = (
    data: BecomeInstructor | BecomeIntern
  ): Promise<void> => api.axiosBecomeInstructor(id, token, data);

  const putUserActiveFalse = (
    reason: string,
    feedback: string
  ): Promise<void> =>
    api.axiosPutUserActive(id, token, false, reason, feedback);

  const getCourses = (): Promise<CourseOverview[]> => api.axiosGetCourses();

  const getCourseTags = (): Promise<Tag[]> => api.axiosGetCourseTags(token);

  const getCourse = (id: string): Promise<CourseOverview> =>
    api.axiosGetCourse(token, id);

  const getMyCourses = (
    type: 'student' | 'pupil'
  ): Promise<CourseOverview[]> => {
    if (type === 'student') {
      return api.axiosGetMyCourses(token, id);
    }

    return api.axiosGetMyCourses(token, undefined, id);
  };

  const createCourse = (course: Course): Promise<number> =>
    api.axiosCreateCourse(token, {
      ...course,
      instructors: [...course.instructors, id],
    });

  const cancelCourse = (courseId: number): Promise<void> =>
    api.axiosCancelCourse(token, courseId);

  const createSubCourse = (
    courseId: number,
    subCourse: SubCourse
  ): Promise<number> =>
    api.axiosCreateSubCourse(token, courseId, {
      ...subCourse,
      instructors: [...subCourse.instructors, id],
    });

  const editSubCourse = (
    courseId: number,
    subCourse: CompletedSubCourse
  ): Promise<void> =>
    api.axiosEditSubCourse(token, courseId, subCourse.id, subCourse);

  const cancelSubCourse = (
    courseId: number,
    subCourseId: number
  ): Promise<void> => api.axiosCancelSubCourse(token, courseId, subCourseId);

  const createLecture = (
    courseId: number,
    subCourseId: number,
    lecture: Lecture
  ): Promise<number> =>
    api.axiosCreateLecture(token, courseId, subCourseId, {
      ...lecture,
      instructor: lecture.instructor.length === 0 ? id : lecture.instructor,
    });

  const editLecture = (
    courseId: number,
    subCourseId: number,
    lecture: CompletedLecture
  ) => api.axiosEditLecture(token, courseId, subCourseId, lecture.id, lecture);

  const cancelLecture = (
    courseId: number,
    subCourseId: number,
    lectureId: number
  ): Promise<void> =>
    api.axiosCancelLecture(token, courseId, subCourseId, lectureId);

  const registerTutee = (tutee: Tutee): Promise<void> =>
    api.axiosRegisterTutee(tutee);

  const registerStateTutee = (tutee: Tutee): Promise<void> =>
    api.axiosRegisterStateTutee(tutee);

  const registerTutor = (tutor: Tutor): Promise<void> =>
    api.axiosRegisterTutor(tutor);

  const checkEmail = (email: string): Promise<void> =>
    api.axiosCheckEmail(email);

  const editInterestConfirmationStatus = (
    token: string,
    status: string
  ): Promise<void> => api.axiosEditInterestConfirmationStatus(token, status);

  const editCourse = (id: number, course: Course) =>
    api.axiosEditCourse(token, id, course);

  const joinCourse = (courseId: number, subCourseId, participantId: string) =>
    api.axiosJoinCourse(token, courseId, subCourseId, participantId);

  const leaveCourse = (courseId: number, subCourseId, participantId: string) =>
    api.axiosLeaveCourse(token, courseId, subCourseId, participantId);

  const joinCourseWaitingList = (
    courseId: number,
    subCourseId,
    participantId: string
  ) =>
    api.axiosJoinCourseWaitingList(token, courseId, subCourseId, participantId);

  const leaveCourseWaitingList = (
    courseId: number,
    subCourseId,
    participantId: string
  ) =>
    api.axiosLeaveCourseWaitingList(
      token,
      courseId,
      subCourseId,
      participantId
    );

  const submitCourse = (id: number, course: Course) =>
    api.axiosSubmitCourse(token, id, course);

  const publishSubCourse = (
    courseId: number,
    id: number,
    subcourse: SubCourse
  ) => api.axiosPublishSubCourse(token, courseId, id, subcourse);

  const sendCourseGroupMail = (
    courseId: number,
    subCourseId: number,
    subject: string,
    body: string,
    addressees: CourseParticipant[]
  ) =>
    api.axiosSendCourseGroupMail(
      token,
      courseId,
      subCourseId,
      subject,
      body,
      addressees
    );

  const issueCourseCertificates = (
    courseId: number,
    subCourseId: number,
    pupilUUIDs: string[]
  ) =>
    api.axiosIssueCourseCertificates(token, courseId, subCourseId, pupilUUIDs);

  const sendCourseInstructorMail = (
    courseId: number,
    subCourseId: number,
    subject: string,
    body: string
  ) =>
    api.axiosSendCourseInstructorMail(
      token,
      courseId,
      subCourseId,
      subject,
      body
    );

  const joinBBBmeeting = (courseId: number, subcourseId: number) =>
    api.axiosJoinBBBmeeting(token, courseId, subcourseId);

  const guestJoinBBBmeeting = (token: string) =>
    api.axiosGuestJoinBBBmeeting(token);

  const getCooperatingSchools = (state?: string): Promise<SchoolInfo[]> =>
    api.axiosGetCooperatingSchool(state);

  const getMentoringMaterial = (type: string, location: string) =>
    api.axiosGetMentoringMaterial(token, type, location);

  const getFeedbackCallData = () => api.axiosGetFeedbackCallData(token);

  const postContactMentor = (message: MenteeMessage) =>
    api.axiosPostContactMentor(token, message);

  const postUserRoleProjectCoach = (projectCoachData: BecomeProjectCoach) =>
    api.axiosPostUserRoleProjectCoach(token, id, projectCoachData);

  const postUserRoleProjectCoachee = (
    projectCoacheeData: BecomeProjectCoachee
  ) => api.axiosPostUserRoleProjectCoachee(token, id, projectCoacheeData);

  const addInstructor = (courseId: number, email: string) =>
    api.axiosAddInstructor(token, courseId, email);

  const inviteCourseGuest = (
    courseID: number,
    email: string,
    firstname: string,
    lastname: string
  ) => api.axiosInviteCourseGuest(token, courseID, email, firstname, lastname);

  const deleteCourseImage = (courseID: number): Promise<void> =>
    api.axiosDeleteCourseImage(token, courseID);

  const getJufoExperts = () => api.axiosGetJufoExperts(token);

  const getUsedExpertTags = () => api.axiosGetUsedExpertTags(token);

  const contactJufoExpert = (id: string, emailText: string, subject: string) =>
    api.axiosContactJufoExpert(token, id, emailText, subject);

  const updateJufoExpert = (id: string, data: ExpertUpdate) =>
    api.axiosUpdateJufoExpert(token, id, data);

  return (
    <ApiContext.Provider
      value={{
        getUserData,
        dissolveMatch,
        dissolveProjectMatch,
        requestNewToken: api.axiosRequestNewToken,
        putUser,
        postUserRoleTutor,
        putUserSubjects,
        putUserProjectFields,
        becomeInstructor,
        putUserActiveFalse,
        createCertificate: withToken(api.axiosCreateCertificate),
        getCertificate: withToken(api.axiosGetCertificate),
        getCertificates: withToken(api.axiosGetCertificates),
        signCertificate: withToken(api.axiosSignCertificate),
        getCourses,
        getCourseTags,
        getCourse,
        getMyCourses,
        registerTutee,
        registerStateTutee,
        checkEmail,
        registerTutor,
        editInterestConfirmationStatus,
        sendCourseGroupMail,
        issueCourseCertificates,
        sendCourseInstructorMail,
        joinCourse,
        leaveCourse,
        joinCourseWaitingList,
        leaveCourseWaitingList,
        submitCourse,
        createCourse,
        createSubCourse,
        createLecture,
        cancelCourse,
        cancelSubCourse,
        cancelLecture,
        publishSubCourse,
        joinBBBmeeting,
        guestJoinBBBmeeting,
        getMentoringMaterial,
        getFeedbackCallData,
        postContactMentor,
        editCourse,
        editSubCourse,
        editLecture,
        getCooperatingSchools,
        postUserRoleProjectCoach,
        postUserRoleProjectCoachee,
        addInstructor,
        inviteCourseGuest,
        deleteCourseImage,
        getJufoExperts,
        getUsedExpertTags,
        updateJufoExpert,
        contactJufoExpert,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
