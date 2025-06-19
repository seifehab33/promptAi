import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowUpLeft } from "lucide-react";
import React from "react";
interface FullScreenProps {
  prompt: string | null;
  promptTitle: string | null;
}
function FullScreen({ prompt, promptTitle }: FullScreenProps) {
  return (
    <Dialog>
      <DialogTrigger>
        <ArrowUpLeft className="w-6 h-6 text-black bg-white rounded-full p-1" />
      </DialogTrigger>
      <DialogContent className="max-w-full max-h-full min-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">aaa</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            aaa
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default FullScreen;
