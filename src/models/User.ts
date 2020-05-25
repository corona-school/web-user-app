export default interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  grade?: number;
  subjects: string[];
  jitsilink: string;
}
