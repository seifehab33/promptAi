import type { AxiosError } from "axios";
import api from "./api";

interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

interface ErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}

interface PorfileData {
  id: number;
  email: string;
  name: string;
  role: {
    id: string;
    name: string;
    description: string;
  };
}

const login = async (loginData: LoginData): Promise<LoginResponse> => {
  try {
    const response = await api.post<{ data: LoginResponse }>(
      "/auth/login",
      loginData
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(axiosError.response?.data?.message || "Login failed");
  }
};

const profileData = async (): Promise<PorfileData> => {
  const response = await api.get<PorfileData>("/users/profile");
  return response.data;
};

const logOut = async (): Promise<{ message: string }> => {
  const response = await api.post<{ data: { message: string } }>(
    "/auth/logout"
  );
  return response.data.data;
};

export { login, profileData, logOut };
