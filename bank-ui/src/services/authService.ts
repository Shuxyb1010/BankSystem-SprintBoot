import axios from "axios";
import type {
  LoginRequest,
  RegisterRequest,
  AuthenticationResponse,
} from "../types/Auth";

const API_BASE_URL = "http://localhost:8080/api";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthenticationResponse> {
    const response = await apiClient.post<AuthenticationResponse>(
      "/auth/login",
      credentials
    );
    return response.data;
  },

  async register(userData: RegisterRequest): Promise<AuthenticationResponse> {
    const response = await apiClient.post<AuthenticationResponse>(
      "/auth/register",
      userData
    );
    return response.data;
  },

  logout(): void {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  setToken(token: string): void {
    localStorage.setItem("authToken", token);
  },

  getToken(): string | null {
    return localStorage.getItem("authToken");
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

export default apiClient;
