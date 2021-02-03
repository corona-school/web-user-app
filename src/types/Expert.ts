export interface Expert {
  id: string;
  firstName: string;
  lastName: string;
  description?: string;
  expertiseTags: string[];
  projectFields: string[];
}

export interface ExpertTag {
  name: string;
  experts: number[];
}

export interface ExpertUpdate {
  contactEmail: string;
  description?: string;
  expertiseTags: string[];
  active: boolean;
}

export interface ExpertData extends ExpertUpdate {
  id: number;
  allowed: ExpertStatus;
}

export enum ExpertStatus {
  PENDING = 'pending', // The permission for expert profile publication is pending
  YES = 'yes', // The profile is allowed to be public
  NO = 'no', // The profile is denied to be public
}
