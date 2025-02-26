export interface User {
    id: string;
    email: string;
    name: string;
    password_hash: string;
    avatar_url?: string;
    is_online: boolean;
    last_seen?: Date;
    created_at?: Date;
    updated_at?: Date;
  }
  
  export interface UserResponse {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
    is_online: boolean;
  }