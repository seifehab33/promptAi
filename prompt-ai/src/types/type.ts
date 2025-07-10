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
  promptContent?: string;
  promptModel: string;
  promptTags?: string[];
  promptContext?: string;
  isPublic?: boolean;
}
export interface ErrorResponse {
  message: string;
}
export interface Prompt {
  id: string;
  promptModel: string;
  promptTitle: string;
  promptDescription: string;
  promptContent: string;
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
  promptModel: string;
  promptTitle: string;
  promptDescription: string;
  promptContent: string;
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
export interface PromptFormFieldsProps {
  promptTitle: string;
  setPromptTitle: (title: string) => void;
  promptContext: string;
  setPromptContext: (context: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
  showTitle?: boolean;
  showContext?: boolean;
  showTags?: boolean;
  showPublicToggle?: boolean;
  className?: string;
}
export interface Likes {
  liked: boolean;
  likes: string[];
}
export interface CheckTokensResponse {
  tokensRemaining: number;
  tokensUsed: number;
  message: string;
}
