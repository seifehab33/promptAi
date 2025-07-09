import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useMemo } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import useCreatePrompt from "@/api/useCreatePrompt";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { usePuterSDK } from "@/hooks/usePuterSDK";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PromptProps {
  prompt: string;
  pdfRef: React.RefObject<HTMLDivElement | null>;
  handleSavePrompt: (
    responseContent?: string,
    model?: string,
    promptContentToSave?: string
  ) => void;
  isPending: boolean;
  setPromptContent: React.Dispatch<React.SetStateAction<string>>;
}

interface Response {
  id: string;
  prompt: string;
  text: string;
  model: string;
}

const TextPrompt = React.memo(function TextPrompt({
  prompt,
  pdfRef,
  handleSavePrompt,
  isPending,
  setPromptContent,
}: PromptProps) {
  const [responses, setResponses] = useState<{ [key: string]: Response[] }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const [pendingPrompt, setPendingPrompt] = useState<{ [key: string]: string }>(
    {}
  );
  const isSDKReady = usePuterSDK();
  const router = useRouter();

  // Function to navigate to model-specific page
  const navigateToModelPage = (model: string) => {
    router.push(`/editor/${model}`);
  };

  // Memoize the typesPrompt array to prevent recreation on every render
  const typesPrompt = useMemo(
    () => [
      {
        id: 1,
        name: "ChatGpt",
        model: "gpt-4o-mini",
      },
      {
        id: 2,
        name: "Claude",
        model: "claude-3-7-sonnet",
      },
      {
        id: 3,
        name: "DeepSeek",
        model: "deepseek-chat",
      },
      {
        id: 4,
        name: "Grok",
        model: "grok-beta",
      },
    ],
    []
  );

  // Create hooks for each model at component level
  const chatGptHook = useCreatePrompt("gpt-4o-mini");
  const claudeHook = useCreatePrompt("claude-3-7-sonnet");
  const deepSeekHook = useCreatePrompt("deepseek-chat");
  const grokHook = useCreatePrompt("grok-beta");

  // Memoize the handleCopy function
  const handleCopy = useMemo(
    () => async (text: string, id: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopiedId(null), 2000);
      } catch (error) {
        console.error("Failed to copy text:", error);
        toast.error("Failed to copy text");
      }
    },
    []
  );

  // Memoize the handleGenerateResponse function
  const handleGenerateResponse = useMemo(
    () => (modelName: string) => {
      if (!prompt.trim()) {
        toast.error("Please enter a prompt before generating");
        return;
      }
      if (!isSDKReady) {
        toast.error(
          "AI service is not available. Please wait a moment and try again."
        );
        return;
      }
      setActiveModel(modelName);
      // Store the prompt for this generation for this model
      setPendingPrompt((prev) => ({ ...prev, [modelName]: prompt }));
      // Get the appropriate hook based on model name
      let hook;
      switch (modelName) {
        case "ChatGpt":
          hook = chatGptHook;
          break;
        case "Claude":
          hook = claudeHook;
          break;
        case "DeepSeek":
          hook = deepSeekHook;
          break;
        case "Grok":
          hook = grokHook;
          break;
        default:
          hook = chatGptHook;
      }
      hook.generatePrompt({
        prompt: prompt,
        context: "",
      });
      toast.info(
        "Click on Save Your Prompt to save your prompt and call it later",
        {
          duration: 3000,
        }
      );
    },
    [
      chatGptHook,
      claudeHook,
      deepSeekHook,
      grokHook,
      isSDKReady,
      setPromptContent,
    ]
  );

  // Memoize the handleStopGeneration function
  const handleStopGeneration = useMemo(
    () => () => {
      if (activeModel) {
        let hook;
        switch (activeModel) {
          case "ChatGpt":
            hook = chatGptHook;
            break;
          case "Claude":
            hook = claudeHook;
            break;
          case "DeepSeek":
            hook = deepSeekHook;
            break;
          case "Grok":
            hook = grokHook;
            break;
          default:
            hook = chatGptHook;
        }
        hook.stopGeneration();
        setActiveModel(null);
      }
    },
    [activeModel, chatGptHook, claudeHook, deepSeekHook, grokHook]
  );

  // Update responses when streaming completes for each model
  useEffect(() => {
    const updateResponse = (
      hook: ReturnType<typeof useCreatePrompt>,
      modelName: string
    ) => {
      if (
        !hook.isStreaming &&
        activeModel === modelName &&
        hook.currentResponse &&
        pendingPrompt[modelName]
      ) {
        const newResponse = {
          id: `${modelName}-${responses[modelName]?.length || 0}`,
          prompt: pendingPrompt[modelName],
          text: hook.currentResponse,
          model: modelName,
        };
        setResponses((prev) => ({
          ...prev,
          [modelName]: [...(prev[modelName] || []), newResponse],
        }));
        setActiveModel(null);
        setPendingPrompt((prev) => ({ ...prev, [modelName]: "" }));
        // Auto-save prompt after 1.5 seconds
        const timeoutId = setTimeout(() => {
          // Find the actual model identifier for this model name
          const modelType = typesPrompt.find((type) => type.name === modelName);
          const modelIdentifier = modelType?.model || modelName;
          // Save the AI response and the prompt content used for generation
          handleSavePrompt(
            hook.currentResponse,
            modelIdentifier,
            pendingPrompt[modelName]
          );
        }, 1500);
        return () => clearTimeout(timeoutId);
      }
    };
    updateResponse(chatGptHook, "ChatGpt");
    updateResponse(claudeHook, "Claude");
    updateResponse(deepSeekHook, "DeepSeek");
    updateResponse(grokHook, "Grok");
  }, [
    chatGptHook.isStreaming,
    chatGptHook.currentResponse,
    claudeHook.isStreaming,
    claudeHook.currentResponse,
    deepSeekHook.isStreaming,
    deepSeekHook.currentResponse,
    grokHook.isStreaming,
    grokHook.currentResponse,
    activeModel,
    pendingPrompt,
    responses,
    handleSavePrompt,
    typesPrompt,
  ]);

  // Memoize the rendered accordion items to prevent unnecessary re-renders
  const renderedAccordionItems = useMemo(() => {
    return typesPrompt.map((type) => {
      // Get the appropriate hook for this model
      let hook;
      switch (type.name) {
        case "ChatGpt":
          hook = chatGptHook;
          break;
        case "Claude":
          hook = claudeHook;
          break;
        case "DeepSeek":
          hook = deepSeekHook;
          break;
        case "Grok":
          hook = grokHook;
          break;
        default:
          hook = chatGptHook;
      }

      const isModelStreaming = hook.isStreaming && activeModel === type.name;
      const isModelPending = hook.isPending && activeModel === type.name;

      return (
        <Accordion key={type.id} type="single" collapsible>
          <AccordionItem
            value={`item-${type.id}`}
            className="border border-gray-600 rounded-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700"
          >
            <div className="flex items-center justify-between px-4 py-3">
              <AccordionTrigger className="text-white hover:no-underline flex-1">
                <span className="text-lg font-bold">{type.name}</span>
              </AccordionTrigger>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateToModelPage(type.model)}
                  className="text-white hover:bg-white/10"
                  title={`Open ${type.name} in full screen`}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <AccordionContent className="px-4 pb-4">
              <div className="bg-gray-800 p-3 rounded-md h-[300px] border border-gray-600 overflow-y-auto">
                {responses[type.name]?.length > 0 || isModelStreaming ? (
                  <div className="space-y-4">
                    {responses[type.name]?.map((response) => (
                      <div key={response.id} className="space-y-2">
                        <div className="bg-gray-700 p-3 rounded-md">
                          <p className="text-sm text-gray-300 mb-2">
                            Prompt: {response.prompt}
                          </p>
                          <p className="whitespace-pre-line flex">
                            <span className="text-sm text-white" ref={pdfRef}>
                              {response.text}
                            </span>
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(response.text, response.id)}
                          className="text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600"
                        >
                          {copiedId === response.id ? (
                            <Check className="h-4 w-4 mr-2" />
                          ) : (
                            <Copy className="h-4 w-4 mr-2" />
                          )}
                          {copiedId === response.id
                            ? "Copied!"
                            : "Copy Response"}
                        </Button>
                      </div>
                    ))}
                    {isModelStreaming && (
                      <div className="space-y-2">
                        <div className="bg-gray-700 p-3 rounded-md">
                          <p className="text-sm text-gray-300 mb-2">
                            Prompt: {pendingPrompt[type.name] || ""}
                          </p>
                          <p className="whitespace-pre-line text-white">
                            {hook.currentResponse}
                          </p>
                          <div className="space-y-2 mt-2">
                            <Skeleton className="h-4 w-[80%] bg-gray-600" />
                            <Skeleton className="h-4 w-[60%] bg-gray-600" />
                            <Skeleton className="h-4 w-[70%] bg-gray-600" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">
                    {isModelStreaming
                      ? "Generating response..."
                      : "Response will appear here"}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end mt-3">
                {isModelStreaming ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white w-full"
                    onClick={handleStopGeneration}
                  >
                    <span>Stop Generation</span>
                  </Button>
                ) : (
                  <div className="w-full flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/10 border-white/20 hover:bg-white/20 text-white w-full"
                      onClick={() => handleGenerateResponse(type.name)}
                      disabled={isModelPending || !prompt.trim()}
                    >
                      <span>
                        {isModelPending ? "Generating..." : "Generate Response"}
                      </span>
                    </Button>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    });
  }, [
    typesPrompt,
    responses,
    copiedId,
    activeModel,
    chatGptHook,
    claudeHook,
    deepSeekHook,
    grokHook,
    handleCopy,
    handleGenerateResponse,
    handleStopGeneration,
    isPending,
    pendingPrompt,
    handleSavePrompt,
  ]);

  return (
    <div className="flex flex-col gap-4 mt-4">{renderedAccordionItems}</div>
  );
});

export default TextPrompt;
