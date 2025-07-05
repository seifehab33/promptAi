import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowUpLeft, Send, Save } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import useGetPromptByModel from "@/api/useGetPromptByModel";
import { Prompt } from "@/types/type";

interface FullScreenProps {
  prompt: string | null;
  promptTitle: string | null;
  model: string;
  onSave?: (
    responseContent?: string,
    model?: string,
    promptContentToSave?: string
  ) => void;
}

function FullScreen({ prompt, promptTitle, model, onSave }: FullScreenProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const { data: promptData } = useGetPromptByModel(model, shouldFetch);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setShouldFetch(true);
    } else {
      // Reset shouldFetch when dialog closes
      setShouldFetch(false);
    }
  };

  const handleSave = () => {
    if (onSave && prompt) {
      // Save the prompt content as both content and description
      onSave(prompt, model, prompt);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <ArrowUpLeft className="w-6 h-6 text-black bg-white rounded-full p-1" />
      </DialogTrigger>

      <DialogContent className="max-w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen overflow-hidden text-white">
        <div className="p-6  h-[calc(100vh-160px)]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {promptTitle || "Prompt Title"}
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-300">
                  {prompt || "Prompt description goes here..."}
                </DialogDescription>
              </div>
              {onSave && prompt && (
                <Button
                  onClick={handleSave}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Prompt
                </Button>
              )}
            </div>
          </DialogHeader>

          {/* Responses in one clean box */}
          <div className="my-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-[500px] overflow-y-auto">
              <h3 className="text-lg font-semibold text-white mb-4  bg-gray-800 pb-2">
                AI Responses
              </h3>
              {promptData?.length === 0 && (
                <div className="text-gray-400 italic text-center py-8">
                  No responses yet. Generate some responses to see them here.
                </div>
              )}
              {promptData ? (
                <div className="text-white whitespace-pre-wrap leading-relaxed">
                  {promptData.map((prompt: Prompt, index: number) => {
                    return (
                      <div key={prompt.id || index}>
                        <div className="text-2xl text-gray-400 mb-2">
                          Response #{index + 1}
                        </div>
                        <div className="text-sm text-gray-400 mb-2">
                          Prompt: {prompt.promptContent || "No prompt content"}
                        </div>
                        <div className="text-white whitespace-pre-wrap leading-relaxed">
                          {prompt.promptDescription}
                        </div>
                        <hr className="my-2 border-t border-gray-700" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-gray-400 italic text-center py-8">
                  No responses yet. Generate some responses to see them here.
                </div>
              )}
            </div>
          </div>

          {/* Saved Prompts for this Model */}
          {promptData && Array.isArray(promptData) && promptData.length > 0 && (
            <div className="my-6">
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-[400px] overflow-y-auto">
                <h3 className="text-lg font-semibold text-white mb-4 bg-gray-800 pb-2">
                  Saved Prompts for {model}
                </h3>
                <div className="space-y-4">
                  {promptData.map((savedPrompt, index: number) => (
                    <div
                      key={savedPrompt.id || index}
                      className="bg-gray-700 p-4 rounded-lg"
                    >
                      <h4 className="text-white font-medium mb-2">
                        {savedPrompt.promptTitle}
                      </h4>
                      <p className="text-gray-300 text-sm mb-2">
                        {savedPrompt.promptDescription}
                      </p>
                      <div className="text-xs text-gray-400">
                        Model: {savedPrompt.promptModel} | Public:{" "}
                        {savedPrompt.isPublic ? "Yes" : "No"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky bottom input */}
        <div className="absolute bottom-0  left-0 w-full p-4 bg-slate-800 border-t border-slate-700">
          <div className="flex items-center gap-2 relative">
            <textarea
              className="w-full p-4 rounded-md resize-none h-20 bg-slate-700 text-white"
              placeholder="Write your prompt here..."
            />
            <Button className="absolute right-2 bottom-2 bg-purple-600 hover:bg-purple-700">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FullScreen;
