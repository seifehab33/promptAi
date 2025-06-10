interface ProfileData {
  id: number;
  email: string;
  name: string;
  role: {
    id: string;
    name: string;
    description: string;
  };
}

export type { ProfileData };
