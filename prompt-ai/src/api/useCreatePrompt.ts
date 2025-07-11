import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

declare global {
  interface Window {
    puter: {
      ai: {
        chat: (
          prompt: string,
          options: { stream: boolean; model: string; context?: string }
        ) => AsyncIterable<{ text: string }>;
      };
    };
  }
}

interface PromptGenerationParams {
  prompt: string;
  context?: string;
}

interface Response {
  id: string;
  text: string;
  prompt: string;
  context?: string;
}

function useCreatePrompt(model: string = "gpt-4") {
  const [responses, setResponses] = useState<Response[]>([]);
  const [currentResponse, setCurrentResponse] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const generatePrompt = async ({
    prompt,
    context,
  }: PromptGenerationParams) => {
    try {
      // Check if Puter SDK is available
      if (!window.puter || !window.puter.ai) {
        throw new Error(
          "Puter AI SDK is not available. Please make sure it's properly loaded."
        );
      }

      const response = await window.puter.ai.chat(prompt, {
        stream: true,
        model,
        context,
      });
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Failed to generate prompt");
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: generatePrompt,
    onSuccess: async (response, variables) => {
      setIsStreaming(true);
      setCurrentResponse("");

      try {
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;
        let fullResponse = "";

        for await (const part of response) {
          if (signal.aborted) {
            break;
          }
          const newText = part?.text ?? "";
          fullResponse += newText;
          setCurrentResponse(fullResponse);
        }

        // Add the completed response to the responses array
        setResponses((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            text: fullResponse,
            prompt: variables.prompt,
            context: variables.context,
          },
        ]);
      } catch (error) {
        if (!abortControllerRef.current?.signal.aborted) {
          toast.error("Error while streaming response " + error);
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to generate prompt");
      }
      setIsStreaming(false);
      abortControllerRef.current = null;
    },
  });

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      toast.info("Generation stopped");
    }
  };

  const clearText = () => {
    setResponses([]);
    setCurrentResponse("");
  };

  return {
    generatePrompt: mutate,
    responses,
    currentResponse,
    isStreaming,
    isPending,
    stopGeneration,
    clearText,
  };
}

export default useCreatePrompt;
