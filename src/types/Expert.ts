import { User } from './index';

export interface Expert {
  user: User;
  contactEmail: string;
  description: string;
  expertiseTags: string[];
  active?: boolean;
}
