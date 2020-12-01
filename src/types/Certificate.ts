export interface IExposedCertificate {
  userIs: 'pupil' | 'student';
  pupil: { firstname: string; lastname: string };
  student: { firstname: string; lastname: string };
  subjects: string;
  categories: string;
  certificateDate: Date;
  startDate: Date;
  endDate: Date;
  uuid: string;
  hoursPerWeek: number;
  hoursTotal: number;
  medium: string;
}
