/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext } from 'react';
import { AxiosResponse } from 'axios';
import { message } from 'antd';
import { AuthContext } from './AuthContext';
import { User, Subject } from '../types';
import * as api from '../api/api';
import { CertificateData } from '../components/Modals/CerificateModal';
import { SchoolInfo, Tutee, Tutor } from '../types/Registration';
import { Course, SubCourse, Lecture, CourseOverview } from '../types/Course';
import { BecomeInstructor, BecomeIntern } from '../types/Instructor';
import { CompletedSubCourse } from '../components/forms/CreateCourse';
import { CompletedLecture } from '../routes/CourseForm';
import { MenteeMessage, Mentoring } from '../types/Mentoring';
import { FeedbackCall } from '../types/FeedbackCall';

interface IApiContext {
  getUserData: () => Promise<User>;
  dissolveMatch: (uuid: string, reason?: number) => Promise<void>;
  requestNewToken: (email: string, redirectTo: string) => Promise<void>;
  putUser: (user: User) => Promise<void>;
  putUserSubjects: (subjects: Subject[]) => Promise<void>;
  becomeInstructor: (data: BecomeInstructor | BecomeIntern) => Promise<void>;
  putUserActiveFalse: () => Promise<void>;
  getCertificate: (
    cerfiticateData: CertificateData
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<AxiosResponse<any>>;
  getCourses: () => Promise<CourseOverview[]>;
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
  registerTutor: (tutor: Tutor) => Promise<void>;
  sendCourseGroupMail: (
    courseId: number,
    subCourseId: number,
    subject: string,
    body: string
  ) => Promise<void>;
  joinBBBmeeting: (
    courseId: number,
    subcourseId: number
  ) => Promise<CourseOverview>;
  getCooperatingSchools: (state: string) => Promise<SchoolInfo[]>;
  getMentoringMaterial: (
    type: string,
    location: string
  ) => Promise<Mentoring[]>;
  getFeedbackCallData: () => Promise<FeedbackCall>;
  postContactMentor: (message: MenteeMessage) => Promise<void>;
}

export const ApiContext = React.createContext<IApiContext>({
  getUserData: () => Promise.reject(),
  dissolveMatch: (uuid, reason?) => Promise.reject(),
  requestNewToken: api.axiosRequestNewToken,
  putUser: (user) => Promise.reject(),
  putUserSubjects: (subjects) => Promise.reject(),
  becomeInstructor: (description: BecomeInstructor | BecomeIntern) =>
    Promise.reject(),
  putUserActiveFalse: () => Promise.reject(),
  getCertificate: (cerfiticateData) => Promise.reject(),
  getCourses: () => Promise.reject(),
  getCourse: (courseId) => Promise.reject(),
  getMyCourses: () => Promise.reject(),
  createCourse: (course) => Promise.reject(),
  cancelCourse: (id) => Promise.reject(),
  editCourse: (id, course) => Promise.reject(),
  joinCourse: (courseId: number, subCourseId: number, participantId: string) =>
    Promise.reject(),
  leaveCourse: (courseId: number, subCourseId: number, participantId: string) =>
    Promise.reject(),
  submitCourse: (id, course) => Promise.reject(),
  publishSubCourse: (courseId, id, course) => Promise.reject(),
  createSubCourse: (id, subCourse) => Promise.reject(),
  editSubCourse: (id, subCourse) => Promise.reject(),
  cancelSubCourse: (id, subCourseId) => Promise.reject(),
  createLecture: (id, subCourseId, lecture) => Promise.reject(),
  editLecture: (id, subCourseId, lecture) => Promise.reject(),
  cancelLecture: (id, subCourseId, lectureId) => Promise.reject(),
  registerTutee: (tutee) => Promise.reject(),
  registerStateTutee: (tutee) => Promise.reject(),
  registerTutor: (tutor) => Promise.reject(),
  sendCourseGroupMail: (id, subCourseId, subject, body) => Promise.reject(),
  joinBBBmeeting: (courseId, subcourseId) => Promise.reject(),
  getCooperatingSchools: (state) => Promise.reject(),
  getMentoringMaterial: (type, location) => Promise.reject(),
  getFeedbackCallData: () => Promise.reject(),
  postContactMentor: (message) => Promise.reject(),
});

export const ApiProvider: React.FC = ({ children }) => {
  const authContext = useContext(AuthContext);

  const {
    credentials: { id, token },
  } = authContext;

  const getUserData = (): Promise<User> => api.axiosGetUser(id, token);

  const dissolveMatch = (uuid: string, reason?: number): Promise<void> =>
    api.axiosDissolveMatch(id, token, uuid, reason);

  const putUser = (user: User): Promise<void> =>
    api.putUser({ id, token }, user);

  const putUserSubjects = (subjects: Subject[]): Promise<void> =>
    api.axiosPutUserSubjects(id, token, subjects);

  const becomeInstructor = (
    data: BecomeInstructor | BecomeIntern
  ): Promise<void> => api.axiosBecomeInstructor(id, token, data);

  const putUserActiveFalse = (): Promise<void> =>
    api.axiosPutUserActive(id, token, false);

  const getCertificate = (
    certificateDate: CertificateData
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<AxiosResponse<any>> =>
    api.axiosGetCertificate(id, token, certificateDate);

  const getCourses = (): Promise<CourseOverview[]> =>
    api.axiosGetCourses(token);

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

  const editCourse = (id: number, course: Course) =>
    api.axiosEditCourse(token, id, course);

  const joinCourse = (courseId: number, subCourseId, participantId: string) =>
    api.axiosJoinCourse(token, courseId, subCourseId, participantId);

  const leaveCourse = (courseId: number, subCourseId, participantId: string) =>
    api.axiosLeaveCourse(token, courseId, subCourseId, participantId);

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
    body: string
  ) =>
    api.axiosSendCourseGroupMail(token, courseId, subCourseId, subject, body);

  const joinBBBmeeting = (courseId: number, subcourseId: number) =>
    api.axiosJoinBBBmeeting(token, courseId, subcourseId);

  const getCooperatingSchools = (state: string): Promise<SchoolInfo[]> =>
    api.axiosGetCooperatingSchool(state);

  const getMentoringMaterial = (type: string, location: string) =>
    api.axiosGetMentoringMaterial(token, type, location);

  const getFeedbackCallData = () => api.axiosGetFeedbackCallData(token);

  const postContactMentor = (message: MenteeMessage) =>
    api.axiosPostContactMentor(token, message);

  return (
    <ApiContext.Provider
      value={{
        getUserData,
        dissolveMatch,
        requestNewToken: api.axiosRequestNewToken,
        putUser,
        putUserSubjects,
        becomeInstructor,
        putUserActiveFalse,
        getCertificate,
        getCourses,
        getCourse,
        getMyCourses,
        registerTutee,
        registerStateTutee,
        registerTutor,
        sendCourseGroupMail,
        joinCourse,
        leaveCourse,
        submitCourse,
        createCourse,
        createSubCourse,
        createLecture,
        cancelCourse,
        cancelSubCourse,
        cancelLecture,
        publishSubCourse,
        joinBBBmeeting,
        getMentoringMaterial,
        getFeedbackCallData,
        postContactMentor,
        editCourse,
        editSubCourse,
        editLecture,
        getCooperatingSchools,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
