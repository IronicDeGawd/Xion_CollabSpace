export interface User {
  id?: number;
  name: string;
  email: string;
  address: string;
  skills: string[];
  image_url?: string;
  created_at?: string;
  updated_at?: string;
  bio?: string;
  // Additional profile data
  xp?: number;
  xpProgress?: number;
  verifiedEmail?: boolean;
  joinedDate?: string;
}
