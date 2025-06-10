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
}
