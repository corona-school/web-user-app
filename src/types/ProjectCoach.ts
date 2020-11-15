export interface BecomeProjectCoach {
  isUniversityStudent?: boolean;
  wasJufoParticipant?: TutorJufoParticipationIndication;
  jufoPastParticipationInfo?: string;
  projectFields?: ApiProjectFieldInfo[];
  hasJufoCertificate?: boolean;
}

export interface BecomeProjectCoachee {
  projectFields: string[];
  isJufoParticipant: TuteeJufoParticipationIndication;
  projectMemberCount: number;
}

export interface ApiProjectFieldInfo {
  name: ProjectField;
  min?: number;
  max?: number;
}

export enum ProjectField {
  ARBEITSWELT = 'Arbeitswelt',
  BIOLOGIE = 'Biologie',
  CHEMIE = 'Chemie',
  GEO_RAUM = 'Geo-und-Raumwissenschaften', // don't use spaces here due to a typeorm issue, see https://github.com/typeorm/typeorm/issues/5275
  MATHE_INFO = 'Mathematik/Informatik',
  PHYSIK = 'Physik',
  TECHNIK = 'Technik',
}

export enum TutorJufoParticipationIndication {
  YES = 'yes', // was past jufo participant
  NO = 'no', // was no past jufo participant
  IDK = 'idk', // don't know whether she*he was jufo participant
}

export enum TuteeJufoParticipationIndication {
  YES = 'yes', // is a jufo participant
  NO = 'no', // is no jufo participant
  UNSURE = 'unsure', // still not sure whether she*he will participate
  NEVERHEARD = 'neverheard', // does not know Jufo
}
