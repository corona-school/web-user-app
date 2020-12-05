export interface Expert {
  id: string;
  firstname: string;
  lastname: string;
  description?: string;
  expertiseTags: string[];
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
