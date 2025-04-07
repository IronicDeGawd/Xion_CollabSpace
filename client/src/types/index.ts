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
  xp?: number;
  xpProgress?: number;
  verifiedEmail?: boolean;
  joinedDate?: string;
}

export interface ExtendedProject {
    project_id: string;
    title: string;
    description: string;
    owner_address: string;
    skills_required: string[];
    status: string;
    collaborator_count: number;
    owner_name?: string;
    owner_image?: string;
    repository_url?: string;
    website_url?: string;
    created_at: string;
    id?: string;
    owner?: string;
    type?: string;
    trust_level?: string;
  }

export interface Project {
    id: string;
    title: string;
    description: string;
    owner: string;
    skills_required: string[];
    type?: string;
    trust_level?: string;
    created_at: string;
  }
