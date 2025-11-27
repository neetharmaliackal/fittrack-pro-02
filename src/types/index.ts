export interface User {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password2: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthTokens {
  refresh: string;
  access: string;
}

export type ActivityType = 'workout' | 'meal' | 'steps';
export type ActivityStatus = 'planned' | 'in_progress' | 'completed';

export interface Activity {
  id: number;
  user: number;
  activity_type: ActivityType;
  description: string;
  date: string;
  status: ActivityStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateActivityPayload {
  activity_type: ActivityType;
  description: string;
  date: string;
  status: ActivityStatus;
}

export interface UpdateActivityPayload {
  activity_type: ActivityType;
  description: string;
  date: string;
  status: ActivityStatus;
}
