"use client";
import { useMutation } from "@tanstack/react-query";
import api, { stopAutoRefresh } from "./axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";

const handleLogout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

const useLogout = () => {
  const router = useRouter();
  const { refreshUser } = useUser();

  const { mutate, isPending, error } = useMutation({
    mutationFn: handleLogout,
    onSuccess: () => {
      // Stop automatic token refresh
      stopAutoRefresh();
      // Refresh user context to clear user data
      refreshUser();
      toast.success("Logged out successfully", {
        style: {
          backgroundColor: "green",
          color: "white",
        },
      });
      window.history.replaceState(null, "", "/");
      router.replace("/");
    },
    onError: () => {
      toast.error("Failed to logout", {
        style: {
          backgroundColor: "red",
          color: "white",
        },
      });
    },
  });
  return { logout: mutate, isPending, error };
};

export default useLogout;
