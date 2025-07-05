"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Copy, Check, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import useCreatePrompt from "@/api/useCreatePrompt";
import useGetPromptByModel from "@/api/useGetPromptByModel";
import useSavePrompt from "@/api/useSavePrompt";
import { Badge } from "@/components/ui/badge";
import PromptFormFields from "@/components/PromptFormFields";
import { Textarea } from "@/components/ui/textarea";
import FullScreen from "@/components/Dialogs/FullScreen";

// Define the valid models
const validModels = [
  { name: "ChatGpt", model: "gpt-4o-mini" },
  { name: "Claude", model: "claude-3-7-sonnet" },
  { name: "DeepSeek", model: "deepseek-chat" },
  { name: "Grok", model: "grok-beta" },
];

export default function ModelPage() {
  const params = useParams();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSavedPrompts, setShowSavedPrompts] = useState(false);
  const [saveFormData, setSaveFormData] = useState({
    promptTitle: "",
    promptContext: "",
    promptTags: [] as string[],
    isPublic: false,
  });
  const [savingResponseId, setSavingResponseId] = useState<string | null>(null);
  const { savePrompt } = useSavePrompt();
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [selectedPromptId, setSelectedPromptId] = useState<string>("");
  const modelParam = params.model as string;

  // Load FullScreen state from localStorage on component mount
  useEffect(() => {
    const savedFullScreenState = localStorage.getItem("fullScreenState");
    if (savedFullScreenState) {
      const { isOpen, promptId } = JSON.parse(savedFullScreenState);
      if (isOpen && promptId) {
        setShowFullScreen(true);
        setSelectedPromptId(promptId);
      }
    }
  }, []);

  // Save FullScreen state to localStorage whenever it changes
  useEffect(() => {
    const fullScreenState = {
      isOpen: showFullScreen,
      promptId: selectedPromptId,
    };
    localStorage.setItem("fullScreenState", JSON.stringify(fullScreenState));
  }, [showFullScreen, selectedPromptId]);

  // Find the model details
  const modelDetails = validModels.find(
    (m) =>
      m.model === modelParam ||
      m.name.toLowerCase() === modelParam.toLowerCase()
  );

  // Create hook for the specific model
  const {
    generatePrompt,
    responses,
    currentResponse,
    isStreaming,
    stopGeneration,
    clearText,
  } = useCreatePrompt(modelDetails?.model || "gpt-4o-mini");
  const { data: savedPrompts } = useGetPromptByModel(
    modelDetails?.model || "",
    true
  );

  // Redirect if model is invalid
  useEffect(() => {
    if (!modelDetails) {
      toast.error("Invalid model specified");
      router.push("/editor");
    }
  }, [modelDetails, router]);

  const handleBackToEditor = () => {
    router.push("/editor");
  };

  const handleGenerateResponse = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt before generating");
      return;
    }

    setIsGenerating(true);
    setCurrentPrompt(prompt);
    generatePrompt({
      prompt: prompt,
      context: "",
    });

    // Clear the prompt after generation starts
    setPrompt("");
  };

  const handleStopGeneration = () => {
    stopGeneration();
    setIsGenerating(false);
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
      toast.error("Failed to copy text");
    }
  };

  const handleViewLibrary = () => {
    router.push("/editor");
  };

  const toggleSavedPrompts = () => {
    setShowSavedPrompts(!showSavedPrompts);
  };

  // Update isGenerating when streaming completes
  useEffect(() => {
    if (!isStreaming && isGenerating) {
      setIsGenerating(false);
      setCurrentPrompt("");
      toast.success("Response generated successfully!");
    }
  }, [isStreaming, isGenerating]);
  const handleCloseFullScreen = () => {
    setShowFullScreen(false);
    setSelectedPromptId("");
    // Clear localStorage when dialog is closed
    localStorage.removeItem("fullScreenState");
  };
  // Set isGenerating when streaming starts
  useEffect(() => {
    if (isStreaming && !isGenerating) {
      setIsGenerating(true);
    }
  }, [isStreaming, isGenerating]);

  if (!modelDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Invalid Model</h1>
          <p className="mb-4">The specified model was not found.</p>
          <Button
            onClick={handleBackToEditor}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Editor
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleBackToEditor}
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Editor
            </Button>
            <Badge className=" to-purple-600 via-purple-900 from-slate-900  text-white">
              <h1 className="text-3xl font-bold text-white">
                {modelDetails.name}
              </h1>
              <p className="text-gray-300">Model: {modelDetails.model}</p>
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleViewLibrary}
              variant="outline"
              className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              View Library
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Input and Form Fields */}
          <div className="space-y-6">
            {/* Prompt Input */}

            {/* Form Fields */}
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Save Prompt Details</h3>
              </div>
              <PromptFormFields
                promptTitle={saveFormData.promptTitle}
                setPromptTitle={(title) =>
                  setSaveFormData({ ...saveFormData, promptTitle: title })
                }
                promptContext={saveFormData.promptContext}
                setPromptContext={(context) =>
                  setSaveFormData({ ...saveFormData, promptContext: context })
                }
                tags={saveFormData.promptTags}
                setTags={(tags) =>
                  setSaveFormData({ ...saveFormData, promptTags: tags })
                }
                isPublic={saveFormData.isPublic}
                setIsPublic={(isPublic) =>
                  setSaveFormData({ ...saveFormData, isPublic })
                }
              />
              <div className="mt-3 text-xs text-gray-400">
                💡 Fill in the details above and save individual responses below
              </div>
            </div>
            <div>
              <label className="block text-white font-medium mb-2">
                Your Prompt
              </label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                className="w-full p-4 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 resize-none h-32"
              />
            </div>

            <Button
              onClick={
                isStreaming ? handleStopGeneration : handleGenerateResponse
              }
              className={`w-full ${
                isStreaming
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-purple-600 hover:bg-purple-700"
              } text-white`}
              disabled={!prompt.trim() || !saveFormData.promptTitle.trim()}
            >
              {isStreaming ? (
                <>
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span>Stop Generation</span>
                  </div>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Generate Response
                </>
              )}
            </Button>
          </div>

          {/* Right Column - Responses */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Responses</h2>
              {responses.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearText}
                  className="text-gray-300 hover:text-white border-gray-600 hover:border-gray-500"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Current Response */}
            {isStreaming && (
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">Generating...</span>
                </div>
                <div className="text-white whitespace-pre-wrap">
                  <div className="mb-2">
                    <span className="text-gray-400 text-sm">Prompt: </span>
                    <span className="text-gray-300">{currentPrompt}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-2">
                    {currentResponse}
                  </div>
                </div>
                {/* Enhanced skeleton loading - always show when streaming */}
                <div className="space-y-3 mt-4">
                  <Skeleton className="h-4 w-[90%] bg-gray-600" />
                  <Skeleton className="h-4 w-[85%] bg-gray-600" />
                  <Skeleton className="h-4 w-[75%] bg-gray-600" />
                  <Skeleton className="h-4 w-[80%] bg-gray-600" />
                  <Skeleton className="h-4 w-[70%] bg-gray-600" />
                  <Skeleton className="h-4 w-[65%] bg-gray-600" />
                </div>
              </div>
            )}

            {/* Previous Responses */}
            {responses.map((response, index) => (
              <div
                key={response.id}
                className="bg-gray-800 p-4 rounded-lg border border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">
                    Response #{index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(response.text, response.id)}
                      className="text-gray-300 hover:text-white"
                    >
                      {copiedId === response.id ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!saveFormData.promptTitle.trim()) {
                          toast.error("Please provide a prompt title first");
                          return;
                        }

                        setSavingResponseId(response.id);
                        const saveData = {
                          promptContent: response.prompt,
                          promptTitle: saveFormData.promptTitle,
                          promptContext: saveFormData.promptContext,
                          promptTags: saveFormData.promptTags,
                          isPublic: saveFormData.isPublic,
                          promptModel: modelDetails?.model || "",
                          promptDescription: response.text,
                        };

                        savePrompt(saveData, {
                          onSuccess: (data) => {
                            const message = data.isUpdate
                              ? "Response updated successfully!"
                              : "Response saved successfully!";
                            toast.success(message);
                            setSavingResponseId(null);
                          },
                          onError: () => {
                            toast.error("Failed to save response");
                            setSavingResponseId(null);
                          },
                        });
                      }}
                      disabled={
                        savingResponseId === response.id ||
                        !saveFormData.promptTitle.trim()
                      }
                      className="text-green-400 hover:text-green-300 border-green-600 hover:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  </div>
                </div>
                <div className="text-white whitespace-pre-wrap">
                  <div className="mb-2">
                    <span className="text-gray-400 text-sm">Prompt: </span>
                    <span className="text-gray-300">{response.prompt}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-2">
                    {response.text}
                  </div>
                </div>
              </div>
            ))}

            {responses.length === 0 && !isStreaming && (
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="text-gray-400 italic text-center py-8">
                  No responses yet. Generate a response to see it here.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Saved Prompts Section */}
        {savedPrompts && savedPrompts.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Saved Prompts</h2>
              <Button
                onClick={toggleSavedPrompts}
                variant="ghost"
                className="text-purple-400 hover:text-purple-300"
              >
                {showSavedPrompts ? "Hide" : "Show"} Saved Prompts
              </Button>
            </div>
            {showSavedPrompts && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedPrompts.map((savedPrompt, index) => (
                  <div
                    key={savedPrompt.id || index}
                    className="bg-gray-800 p-4 rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                    onClick={() => {
                      setSelectedPromptId(savedPrompt.id || "");
                      setShowFullScreen(true);
                    }}
                  >
                    <h4 className="text-white font-medium mb-2">
                      {savedPrompt.promptTitle}
                    </h4>
                    <p className="text-gray-300 text-sm mb-2 line-clamp-3">
                      {savedPrompt.promptDescription}
                    </p>
                    <div className="text-xs text-gray-400">
                      Model: {savedPrompt.promptModel} | Public:{" "}
                      {savedPrompt.isPublic ? "Yes" : "No"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {showFullScreen && (
        <FullScreen
          id={selectedPromptId}
          isOpen={showFullScreen}
          onClose={handleCloseFullScreen}
        />
      )}
    </div>
  );
}
