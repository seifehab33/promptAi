import useGetPromptByID from "@/api/useGetPromptByID";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { Textarea } from "../ui/textarea";
import useCreatePrompt from "@/api/useCreatePrompt";
import useSavePrompt from "@/api/useSavePrompt";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import responseai from "@/assets/images/response ai.svg";
import Image from "next/image";

interface FullScreenProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

function FullScreen({ id, isOpen, onClose }: FullScreenProps) {
  const [newPrompt, setNewPrompt] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [responses, setResponses] = useState<
    Array<{ id: string; prompt: string; response: string }>
  >([]);

  const { data, isLoading, refetch } = useGetPromptByID(id);
  const { generatePrompt, currentResponse, isStreaming, stopGeneration } =
    useCreatePrompt(data?.promptModel || "gpt-4o-mini");
  const { savePrompt } = useSavePrompt();
  const [savingResponseId, setSavingResponseId] = useState<string | null>(null);

  // Note: Backend now handles grouping automatically based on prompt content similarity

  const handleGenerateNewPrompt = () => {
    if (!newPrompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setCurrentPrompt(newPrompt);
    generatePrompt({
      prompt: newPrompt,
      context: "",
    });
    setNewPrompt("");
  };

  const handleStopGeneration = () => {
    stopGeneration();
    setIsGenerating(false);
  };

  const isExistingResponse = (response: {
    id: string;
    prompt: string;
    response: string;
  }) => {
    // Check if this response is already in the database
    if (!data?.promptDescription) return false;

    // Check if the response text is already in the database prompt description
    return data.promptDescription.includes(response.response);
  };

  const handleSaveResponse = (response: {
    id: string;
    prompt: string;
    response: string;
  }) => {
    setSavingResponseId(response.id);

    // Use the original prompt title from the dialog data
    const saveData = {
      promptContent: response.prompt,
      promptTitle: data?.promptTitle || "New Prompt",
      promptContext: data?.promptContext || "",
      promptTags: data?.promptTags || [],
      isPublic: data?.isPublic || false,
      promptModel: data?.promptModel || "gpt-4o-mini", // Ensure we always have a valid model
      promptDescription: response.response,
    };

    savePrompt(saveData, {
      onSuccess: (data) => {
        let message = "Response saved successfully!";

        if (data.isUpdate) {
          message = "Response updated successfully!";
        } else if (data.grouped) {
          message = "Response grouped with existing prompt!";
        }

        toast.success(message);
        setSavingResponseId(null);
        // Immediately refetch the prompt data to update UI
        refetch();
      },
      onError: () => {
        toast.error("Failed to save response");
        setSavingResponseId(null);
      },
    });
  };

  // Parse existing prompt data to extract all prompt-content pairs
  React.useEffect(() => {
    if (data && data.promptContent && data.promptDescription) {
      const parsedResponses: Array<{
        id: string;
        prompt: string;
        response: string;
      }> = [];

      // Split content by "--- Additional Prompt ---"
      const promptParts = data.promptContent.split("--- Additional Prompt ---");
      const responseParts = data.promptDescription.split(
        "--- Additional Response ---"
      );

      // Clean and map the parts
      const prompts = promptParts
        .map((part: string) => part.trim())
        .filter((part: string) => part.length > 0);
      const responses = responseParts
        .map((part: string) => part.trim())
        .filter((part: string) => part.length > 0);

      // Create pairs (use the longer array length)
      const maxLength = Math.max(prompts.length, responses.length);

      for (let i = 0; i < maxLength; i++) {
        parsedResponses.push({
          id: `existing-${i}`,
          prompt: prompts[i] || "No prompt content",
          response: responses[i] || "No response content",
        });
      }

      setResponses(parsedResponses);
    }
  }, [data]);

  // Update responses when streaming completes
  React.useEffect(() => {
    if (!isStreaming && isGenerating && currentResponse) {
      setIsGenerating(false);
      setResponses((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          prompt: currentPrompt,
          response: currentResponse,
        },
      ]);
      setCurrentPrompt("");
      toast.success("Response generated successfully!");
    }
  }, [isStreaming, isGenerating, currentResponse, currentPrompt]);

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="max-w-4xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-[80vh] overflow-y-auto text-white"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Loading Prompt
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-64">
            <div className="text-white">Loading...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!data) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="max-w-4xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-[80vh] overflow-y-auto text-white"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Prompt Not Found
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-64">
            <div className="text-white">No data found</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-[80vh] max-h-[90vh] flex flex-col text-white"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-white">
                {data.promptTitle}
              </DialogTitle>
              <DialogDescription className="text-gray-300 mt-2">
                Chat with AI - Continue the conversation
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-6 flex-1 overflow-y-auto min-h-0">
          {/* Context Info */}
          {data.promptContext && (
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <span className="text-gray-400 text-sm">Context: </span>
              <span className="text-gray-300 text-sm">
                {data.promptContext}
              </span>
            </div>
          )}

          {/* Chat Responses */}
          {responses.map((response) => (
            <div key={response.id} className="space-y-4">
              {/* User Message */}
              <div className="bg-purple-700 p-4 rounded-lg">
                <p className="text-white font-medium">You:</p>
                <p className="text-gray-300 mt-1">{response.prompt}</p>
              </div>

              {/* AI Response */}
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-white font-medium flex items-center gap-2">
                      <Image
                        src={responseai}
                        alt="Response AI"
                        width={30}
                        height={30}
                        className="rounded-full"
                      />
                    </p>
                    <p className="text-gray-300 mt-1 whitespace-pre-wrap">
                      {response.response}
                    </p>
                  </div>
                  {!isExistingResponse(response) && (
                    <Button
                      onClick={() => handleSaveResponse(response)}
                      disabled={savingResponseId === response.id}
                      size="sm"
                      className="ml-3 text-green-400 hover:text-green-300 border-green-600 hover:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      variant="outline"
                    >
                      {savingResponseId === response.id ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-400 mr-1"></div>
                          <span className="text-xs">Saving...</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-xs">Save</span>
                        </div>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Current Generation */}
          {isStreaming && (
            <div className="space-y-4">
              <div className="bg-purple-700 p-4 rounded-lg">
                <p className="text-white font-medium">You:</p>
                <p className="text-white mt-1">{currentPrompt}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-white font-medium">
                  <Image
                    src={responseai}
                    alt="Response AI"
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                </p>
                <p className="text-gray-300 mt-1 whitespace-pre-wrap">
                  {currentResponse}
                </p>
                <div className="space-y-2 mt-3">
                  <Skeleton className="h-4 w-[80%] bg-gray-600" />
                  <Skeleton className="h-4 w-[60%] bg-gray-600" />
                  <Skeleton className="h-4 w-[70%] bg-gray-600" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input - Fixed at bottom */}
        <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700 flex-shrink-0">
          <div className="flex items-end gap-3">
            <Textarea
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 min-h-[60px] max-h-[120px] bg-gray-700 border-gray-600 text-white placeholder-gray-400 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerateNewPrompt();
                }
              }}
            />
            <Button
              onClick={
                isStreaming ? handleStopGeneration : handleGenerateNewPrompt
              }
              disabled={!newPrompt.trim() && !isStreaming}
              className={`px-4 py-2 ${
                isStreaming
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-purple-600 hover:bg-purple-700"
              } text-white`}
            >
              {isStreaming ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Stop
                </div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FullScreen;
