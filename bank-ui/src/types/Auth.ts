export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthenticationResponse {
  token: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}
