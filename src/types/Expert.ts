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
