import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
interface FullScreenProps {
  prompt: string | null;
  promptTitle: string | null;
}
function FullScreen({ prompt, promptTitle }: FullScreenProps) {
  return (
    <Dialog>
      <DialogTrigger>Chat with Full Screen</DialogTrigger>
      <DialogContent className="max-w-full max-h-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {promptTitle}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {prompt}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default FullScreen;
