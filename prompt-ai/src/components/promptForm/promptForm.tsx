import React, { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { PublicPrivateSwitch } from "@/components/Switch/public-private-switch";
import { Zap } from "lucide-react";
import PromptFormFields from "@/components/PromptFormFields";
import TextPrompt from "@/app/(pages)/editor/_textPrompt";
import ImagePrompt from "@/app/(pages)/editor/_imagePrompt";
import { Textarea } from "@/components/ui/textarea";
import useSavePrompt from "@/api/useSavePrompt";

const promptTypes = [
  { value: "chat", label: "Chat Prompt", icon: "💬" },
  { value: "image", label: "Image Prompt", icon: "🎨" },
  { value: "code", label: "Code Prompt", icon: "💻" },
];

function PromptForm() {
  const [promptType, setPromptType] = useState("chat");
  const [promptTitle, setPromptTitle] = useState("");
  const [promptContext, setPromptContext] = useState("");
  const [promptContent, setPromptContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const pdfRef = useRef<HTMLDivElement | null>(null);
  const { savePrompt, isPending } = useSavePrompt();

  const handleSavePrompt = () => {
    savePrompt({
      promptTitle,
      promptContext,
      promptContent,
      isPublic,
      promptTags: tags,
      promptModel: "gpt-4o-mini",
      promptDescription: promptContext,
    });
  };

  return (
    <div className="lg:col-span-2">
      <Card className="mb-6 bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Prompt Type Selection */}
            <div className="flex flex-col gap-4 ">
              <label
                htmlFor="prompt-type"
                className="text-sm font-medium text-gray-300 mb-2 block"
              >
                Prompt Type
              </label>
              <div className="flex items-center gap-4">
                <div className="w-full max-w-xs">
                  <Select value={promptType} onValueChange={setPromptType}>
                    <SelectTrigger
                      id="prompt-type"
                      className="bg-white/10 border-white/20 text-white"
                    >
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {promptTypes.map((type) => (
                        <SelectItem
                          key={type.value}
                          value={type.value}
                          className="text-white hover:bg-gray-700"
                        >
                          <span className="mr-2">{type.icon}</span>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <PublicPrivateSwitch
                    isPublic={isPublic}
                    setIsPublic={setIsPublic}
                  />
                </div>
              </div>
            </div>

            {/* Form Fields Component */}
            {(promptType === "chat" || promptType === "code") && (
              <PromptFormFields
                promptTitle={promptTitle}
                setPromptTitle={setPromptTitle}
                promptContext={promptContext}
                setPromptContext={setPromptContext}
                tags={tags}
                setTags={setTags}
                isPublic={isPublic}
                setIsPublic={setIsPublic}
              />
            )}

            {/* Prompt Content */}
            {(promptType === "chat" || promptType === "code") && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Prompt Content
                </label>
                <Textarea
                  placeholder="Enter your prompt here... Be specific and detailed for better AI responses."
                  className="min-h-32 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 resize-none"
                  value={promptContent}
                  onChange={(e) => setPromptContent(e.target.value)}
                />
              </div>
            )}

            {promptType === "chat" || promptType === "code" ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    AI Response Generation
                  </span>
                </div>
                <TextPrompt
                  setPromptContent={setPromptContent}
                  prompt={promptContent}
                  pdfRef={pdfRef}
                  handleSavePrompt={handleSavePrompt}
                  isPending={isPending}
                />
              </div>
            ) : (
              <div className="flex items-center justify-end w-full">
                <ImagePrompt />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PromptForm;
