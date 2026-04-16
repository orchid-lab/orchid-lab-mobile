export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  avatarUrl: string | null;
  createdDate?: string;
}

export interface EditForm {
  name: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
}