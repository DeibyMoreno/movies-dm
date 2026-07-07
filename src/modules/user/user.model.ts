export interface UserModel {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  avatar_url: string | null;
  role_id: string;
  created_at: Date;
  updated_at: Date;
}
