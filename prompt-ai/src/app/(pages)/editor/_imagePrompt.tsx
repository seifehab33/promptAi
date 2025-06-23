// import { Button } from "@/components/ui/button";
// import React, { useState, useMemo } from "react";
// import { Copy, Check, Download, Trash2 } from "lucide-react";
// import { toast } from "sonner";
// import { Skeleton } from "@/components/ui/skeleton";
// import FullScreen from "@/components/Dialogs/FullScreen";
// import Image from "next/image";
// import useTextToImage from "@/api/useTextToImage";

// interface PromptProps {
//   prompt: string;
// }

// interface GeneratedImage {
//   id: string;
//   prompt: string;
//   imageUrl: string;
// }

// function ImagePrompt({ prompt }: PromptProps) {
//   const [copiedId, setCopiedId] = useState<string | null>(null);
//   const [activeModel, setActiveModel] = useState<string | null>(null);
//   const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const { generateImage } = useTextToImage();
//   // Memoize the typesPrompt array to prevent recreation on every render
//   const typesPrompt = useMemo(
//     () => [
//       {
//         id: 1,
//         name: "Dall-E",
//       },
//     ],
//     []
//   );

//   // Memoize the handleCopy function
//   const handleCopy = useMemo(
//     () => async (text: string, id: string) => {
//       try {
//         await navigator.clipboard.writeText(text);
//         setCopiedId(id);
//         toast.success("Copied to clipboard!");
//         setTimeout(() => setCopiedId(null), 2000);
//       } catch (error) {
//         console.error("Failed to copy text:", error);
//         toast.error("Failed to copy text");
//       }
//     },
//     []
//   );

//   // Memoize the handleDownload function
//   const handleDownload = useMemo(
//     () => (imageUrl: string) => {
//       const link = document.createElement("a");
//       link.href = imageUrl;
//       link.download = `generated-image-${Date.now()}.png`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       toast.success("Image downloaded!");
//     },
//     []
//   );

//   // Memoize the handleGenerateImage function
//   const handleGenerateImage = useMemo(
//     () => async (modelName: string) => {
//       if (!prompt.trim()) {
//         toast.error("Please enter a prompt before generating");
//         return;
//       }

//       setActiveModel(modelName);
//       setIsLoading(true);

//       try {
//         toast.info("Image generation started. This may take a few moments...", {
//           duration: 3000,
//         });

//         const imageUrl = await generateImage({ prompt, testMode: false });

//         setGeneratedImages((prev) => [
//           ...prev,
//           {
//             id: Date.now().toString(),
//             prompt: prompt,
//             imageUrl: imageUrl as unknown as string,
//           },
//         ]);

//         toast.success("Image generated successfully!");
//       } catch (error) {
//         console.error("Failed to generate image:", error);
//         toast.error("Failed to generate image. Please try again.");
//       } finally {
//         setIsLoading(false);
//         setActiveModel(null);
//       }
//     },
//     [prompt]
//   );

//   // Memoize the handleStopGeneration function
//   const handleStopGeneration = useMemo(
//     () => () => {
//       setIsLoading(false);
//       setActiveModel(null);
//       toast.info("Generation stopped");
//     },
//     []
//   );

//   // Memoize the rendered cards to prevent unnecessary re-renders
//   const renderedCards = useMemo(() => {
//     return typesPrompt.map((type) => {
//       const isModelGenerating = isLoading && activeModel === type.name;
//       const isModelPending = isLoading && activeModel === type.name;

//       return (
//         <div
//           key={type.id}
//           className="w-full h-full p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 rounded-lg shadow-lg border border-gray-600"
//         >
//           <div className="text-white text-lg font-bold flex items-center justify-between mb-3">
//             <div className="flex items-center gap-2 justify-between w-full">
//               {type.name}
//               <FullScreen prompt={prompt} promptTitle={type.name} />
//             </div>
//           </div>
//           <hr className="border-gray-500 my-3" />

//           <div className="bg-gray-800 p-3 rounded-md h-[400px] w-full border border-gray-600 overflow-y-auto">
//             {generatedImages.length > 0 || isModelGenerating ? (
//               <div className="space-y-4">
//                 {generatedImages.map((imageResponse) => (
//                   <div key={imageResponse.id} className="space-y-2">
//                     <div className="bg-gray-700 p-3 rounded-md">
//                       <p className="text-sm text-gray-300 mb-2">
//                         Prompt: {imageResponse.prompt}
//                       </p>
//                       <div className="flex flex-col items-center">
//                         {imageResponse.imageUrl ? (
//                           <Image
//                             src={imageResponse.imageUrl}
//                             alt={`Generated image for: ${imageResponse.prompt}`}
//                             width={300}
//                             height={300}
//                             className="max-w-full h-auto rounded-md shadow-lg"
//                             style={{ maxHeight: "300px" }}
//                           />
//                         ) : (
//                           <div className="text-gray-400 text-center">
//                             No image available
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                     <div className="flex gap-2">
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() =>
//                           handleCopy(imageResponse.prompt, imageResponse.id)
//                         }
//                         className="text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600"
//                       >
//                         {copiedId === imageResponse.id ? (
//                           <Check className="h-4 w-4 mr-2" />
//                         ) : (
//                           <Copy className="h-4 w-4 mr-2" />
//                         )}
//                         {copiedId === imageResponse.id
//                           ? "Copied!"
//                           : "Copy Prompt"}
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => handleDownload(imageResponse.imageUrl)}
//                         className="text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600"
//                       >
//                         <Download className="h-4 w-4 mr-2" />
//                         Download
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//                 {isModelGenerating && (
//                   <div className="space-y-2">
//                     <div className="bg-gray-700 p-3 rounded-md">
//                       <p className="text-sm text-gray-300 mb-2">
//                         Prompt: {prompt}
//                       </p>
//                       <div className="flex flex-col items-center justify-center h-[300px]">
//                         <div className="text-white text-center mb-4">
//                           Generating image...
//                         </div>
//                         <div className="space-y-2">
//                           <Skeleton className="h-4 w-[80%] bg-gray-600" />
//                           <Skeleton className="h-4 w-[60%] bg-gray-600" />
//                           <Skeleton className="h-4 w-[70%] bg-gray-600" />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <p className="text-gray-400 italic text-center h-full flex items-center justify-center">
//                 {isModelGenerating
//                   ? "Generating image..."
//                   : "Generated images will appear here"}
//               </p>
//             )}
//           </div>

//           <div className="flex items-center justify-between mt-3 gap-2">
//             {generatedImages.length > 0 && (
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setGeneratedImages([])}
//                 className="bg-red-600/10 border-red-600/20 hover:bg-red-600/20 text-red-400 hover:text-red-300"
//               >
//                 <Trash2 className="h-4 w-4 mr-2" />
//                 Clear All
//               </Button>
//             )}
//             {isModelGenerating ? (
//               <Button
//                 variant="destructive"
//                 size="sm"
//                 className="bg-red-600 hover:bg-red-700 text-white flex-1"
//                 onClick={handleStopGeneration}
//               >
//                 <span>Stop Generation</span>
//               </Button>
//             ) : (
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="bg-white/10 border-white/20 hover:bg-white/20 text-white flex-1"
//                 onClick={() => handleGenerateImage(type.name)}
//                 disabled={isModelPending || !prompt}
//               >
//                 <span>
//                   {isModelPending ? "Generating..." : "Generate Image"}
//                 </span>
//               </Button>
//             )}
//           </div>
//         </div>
//       );
//     });
//   }, [
//     typesPrompt,
//     generatedImages,
//     isLoading,
//     copiedId,
//     activeModel,
//     prompt,
//     handleCopy,
//     handleDownload,
//     handleGenerateImage,
//     handleStopGeneration,
//   ]);

//   return <div className="w-full mt-4">{renderedCards}</div>;
// }

// export default ImagePrompt;
import React from "react";

function _imagePrompt() {
  return (
    <div>
      <iframe
        src="https://pratap2002-text-to-image.hf.space"
        frameBorder="0"
        width="850"
        height="450"
      ></iframe>
    </div>
  );
}

export default _imagePrompt;
