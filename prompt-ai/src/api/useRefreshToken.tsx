import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

interface RefreshTokenResponse {
  data: {
    access_token: string;
    refresh_token: string;
  };
}

const refreshToken = async () => {
  try {
    const response = await axios.post<RefreshTokenResponse>(
      `http://localhost:3001/auth/refresh`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to refresh token");
  }
};

function useRefreshToken() {
  return useMutation({
    mutationFn: refreshToken,
    onError: () => {
      toast.error("Session expired. Please sign in again.");
      window.location.href = "/SignIn";
    },
  });
}

export default useRefreshToken;
