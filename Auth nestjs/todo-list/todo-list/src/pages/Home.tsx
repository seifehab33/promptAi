import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { profileData } from "@/api/useLogin";
import { toast } from "sonner";
import type { ProfileData } from "@/types/types";

export default function Home() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      localStorage.removeItem("token");
      document.cookie =
        "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      toast.success("Logout successful");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
      localStorage.removeItem("token");
      document.cookie =
        "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      navigate("/", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const data = await profileData();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, {profile?.name}!</h1>
      <p className="text-gray-400 mb-8">Role: {profile?.role.name}</p>
      dsadas
      {/* Add your todo list content here */}
      <button
        onClick={logout}
        disabled={isLoggingOut}
        className={`bg-red-500 text-white px-4 py-2 rounded-md ${
          isLoggingOut ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
        }`}
      >
        {isLoggingOut ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}
