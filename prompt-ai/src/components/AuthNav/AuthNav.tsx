"use client";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import publicommunity from "@/assets/images/publicommunity.svg";
import useLogout from "@/api/useLogout";
import { usePathname, useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import { useUser } from "@/context/userContext";
import { parseCookies } from "nookies";
function AuthNav() {
  const router = useRouter();
  const { logout, isPending } = useLogout();
  const { user } = useUser();
  const handleSignOut = () => {
    logout();
  };
  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };
  const isPublicCommunity = usePathname() === "/community";
  const handlePublicCommunity = () => {
    router.push("/community");
  };
  const cookies = parseCookies();
  const accessToken = cookies.access_token;
  // const userName = accessToken?.split(".")[1];
  return (
    <div>
      <header className="relative bg-white/10 backdrop-blur-md border-b border-white/20 py-4 shadow-lg">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-promptsmith-purple flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              PromptSmith
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <Badge
                variant="outline"
                className="bg-white/10 border-white/20 text-white"
              >
                {user?.name}
              </Badge>
            </div>
            {!isPublicCommunity ? (
              <Button
                variant="ghost"
                onClick={handlePublicCommunity}
                className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400 text-white hover:from-purple-500/30 hover:to-pink-500/30"
              >
                <Image
                  src={publicommunity}
                  alt="public community"
                  className="w-10 h-10 p-1"
                />
                <span className="text-sm">Public Community</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={handleBackToDashboard}
                className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400 text-white hover:from-purple-500/30 hover:to-pink-500/30"
              >
                <span className="text-sm">Back to Dashboard</span>
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={handleSignOut}
              disabled={isPending}
              className="text-white hover:bg-white/10 border border-white/20"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default AuthNav;
