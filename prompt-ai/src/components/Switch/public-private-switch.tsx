"use client";

import { Globe, GlobeLock } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label"; // Assuming Label is available from shadcn/ui
interface PublicPrivateSwitchProps {
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
}
export function PublicPrivateSwitch({
  isPublic,
  setIsPublic,
}: PublicPrivateSwitchProps) {
  return (
    <div className="flex items-center space-x-2">
      {isPublic ? (
        <Globe className="h-5 w-5 text-green-600" aria-label="Public" />
      ) : (
        <GlobeLock className="h-5 w-5 text-red-600" aria-label="Private" />
      )}
      <Label htmlFor="public-private-switch" className="sr-only">
        Toggle public/private status
      </Label>
      <Switch
        id="public-private-switch"
        checked={isPublic}
        onCheckedChange={setIsPublic}
        aria-checked={isPublic}
        aria-label={isPublic ? "Set to private" : "Set to public"}
      />
      <span className="text-sm font-medium">
        {isPublic ? "Public" : "Private"}
      </span>
    </div>
  );
}
