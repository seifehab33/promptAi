import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface ImageGenerationParams {
  prompt: string;
  testMode?: boolean;
}

interface ImageResponse {
  id: string;
  prompt: string;
  imageUrl: string;
  imageElement: HTMLImageElement;
}

const generateImage = async ({
  prompt,
  testMode = false,
}: ImageGenerationParams) => {
  try {
    const puter = (
      window as unknown as {
        puter: {
          ai: {
            txt2img: (
              prompt: string,
              testMode?: boolean
            ) => Promise<HTMLImageElement>;
          };
        };
      }
    ).puter;
    const imageElement = await puter.ai.txt2img(prompt, testMode);
    return imageElement;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to generate image");
  }
};

function useTextToImage() {
  const [images, setImages] = useState<ImageResponse[]>([]);
  const [currentImage, setCurrentImage] = useState<HTMLImageElement | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: generateImage,
    onSuccess: async (imageElement, variables) => {
      setIsGenerating(true);
      setCurrentImage(null);

      try {
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        if (signal.aborted) {
          return;
        }

        // Convert image element to data URL for storage
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = imageElement.naturalWidth;
        canvas.height = imageElement.naturalHeight;
        ctx?.drawImage(imageElement, 0, 0);
        const imageUrl = canvas.toDataURL("image/png");

        setCurrentImage(imageElement);

        // Add the completed image to the images array
        setImages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            prompt: variables.prompt,
            imageUrl: imageUrl,
            imageElement: imageElement,
          },
        ]);
      } catch (error) {
        if (!abortControllerRef.current?.signal.aborted) {
          toast.error("Error while generating image " + error);
        }
      } finally {
        setIsGenerating(false);
        abortControllerRef.current = null;
      }
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to generate image");
      }
      setIsGenerating(false);
      abortControllerRef.current = null;
    },
  });

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
      toast.info("Generation stopped");
    }
  };

  const clearImages = () => {
    setImages([]);
    setCurrentImage(null);
  };

  return {
    generateImage: mutate,
    images,
    currentImage,
    isGenerating,
    isPending,
    stopGeneration,
    clearImages,
  };
}

export default useTextToImage;
// hooks/useImageGeneration.ts
// lib/generateImage.ts
