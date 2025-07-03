export interface User {
  name: string;
  email: string;
}
export interface SignUpData {
  name: string;
  email: string;
  password: string;
}
export interface SignResponse {
  access_token: string;
  refresh_token: string;
}
export interface SignInData {
  email: string;
  password: string;
}
export interface CreatePromptData {
  promptTitle?: string;
  promptDescription: string;
  promptTags?: string[];
  promptContext?: string;
  isPublic?: boolean;
}
export interface ErrorResponse {
  message: string;
}
export interface Prompt {
  id: string;
  promptTitle: string;
  promptDescription: string;
  promptTags: string[];
  promptContext: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  likes: string[];
  user: {
    id: string;
    name: string;
    email: string;
  };
}
export type PromptUpdate = Partial<Prompt>;
export interface ForgetPassResponse {
  data: {
    message: string;
  };
}
export interface ResetPasswordData {
  token: string;
  newPassword: string;
}
export interface PublicPrompt {
  id: string;
  promptTitle: string;
  promptDescription: string;
  promptTags: string[];
  promptContext: string;
  isPublic: boolean;
  likes: string[];
  user: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
}
