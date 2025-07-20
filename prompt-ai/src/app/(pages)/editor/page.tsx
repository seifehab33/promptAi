"use client";
import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tag, Zap, ArrowLeft } from "lucide-react";
import TagInput from "@/components/TagInput";

import { useRouter } from "next/navigation";
import TextPrompt from "../../../components/editor/_textPrompt";
import { Textarea } from "@/components/ui/textarea";
import ImagePrompt from "../../../components/editor/_imagePrompt";
import useSavePrompt from "@/api/useSavePrompt";
import { PublicPrivateSwitch } from "@/components/Switch/public-private-switch";
import { useUser } from "@/context/userContext";
import { Badge } from "@/components/ui/badge";
import Library from "../../../components/editor/_library";
import PromptCheckTokens from "@/components/prompts/promptCheckTokens";
const promptTypes = [
  { value: "chat", label: "Chat Prompt", icon: "💬" },
  { value: "image", label: "Image Prompt", icon: "🎨" },
  { value: "code", label: "Code Prompt", icon: "💻" },
];

const PromptEditor = () => {
  const [promptTitle, setPromptTitle] = useState("");
  const [promptContent, setPromptContent] = useState("");
  const [promptContext, setPromptContext] = useState("");
  const [promptType, setPromptType] = useState("chat");
  const [tags, setTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user } = useUser();
  const userName = user?.name;
  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };
  const { savePrompt, isPending } = useSavePrompt();
  const handleSavePrompt = useCallback(
    (
      responseContent?: string,
      model?: string,
      promptContentToSave?: string
    ) => {
      savePrompt({
        promptTitle,
        promptContent: promptContentToSave || promptContent,
        promptDescription: responseContent || promptContent,
        promptContext: promptContext,
        promptTags: tags,
        isPublic: isPublic,
        promptModel: model || promptType,
      });
    },
    [
      savePrompt,
      promptTitle,
      promptContent,
      promptContext,
      tags,
      isPublic,
      promptType,
    ]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <header className="relative bg-white/10 backdrop-blur-md border-b border-white/20 py-4 shadow-lg">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-promptsmith-purple flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              PromptSmith
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-white/10 border-white/20 text-white"
            >
              {userName}
            </Badge>
            <Button
              variant="ghost"
              onClick={handleBackToDashboard}
              className="text-white hover:bg-white/10 border border-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            AI Prompt Editor
          </h1>
          <p className="text-gray-300 text-lg">
            Create, test, and save powerful AI prompts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-6 bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {(promptType === "chat" || promptType === "code") && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 justify-between">
                        <label className="text-sm font-medium text-gray-300">
                          Prompt Title
                        </label>
                        <PromptCheckTokens />
                      </div>
                      <Input
                        placeholder="Enter a descriptive title..."
                        value={promptTitle}
                        onChange={(e) => setPromptTitle(e.target.value)}
                        className="font-medium text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400"
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-4 ">
                    <label
                      htmlFor="prompt-type"
                      className="text-sm font-medium text-gray-300 mb-2 block"
                    >
                      Prompt Type
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-full max-w-xs">
                        <Select
                          value={promptType}
                          onValueChange={setPromptType}
                        >
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

                  {(promptType === "chat" || promptType === "code") && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <Tag className="h-4 w-4 text-white" />
                        </div>{" "}
                        Tags
                      </div>
                      <TagInput tags={tags} setTags={setTags} />
                    </div>
                  )}

                  <div>
                    {(promptType === "chat" || promptType === "code") && (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">
                            Prompt Context
                          </label>
                          <Input
                            placeholder="Enter a descriptive context..."
                            value={promptContext}
                            onChange={(e) => setPromptContext(e.target.value)}
                            className="font-medium text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400"
                          />
                        </div>
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
                      </>
                    )}
                  </div>

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

            {/* {responses.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Response Comparison</h2>
                <ComparisonView responses={[]} />
              </div>
            )} */}
          </div>
          <Library />
        </div>
      </main>

      {/* Hidden div for PDF export */}
      <div ref={pdfRef} style={{ display: "none" }}>
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
          <h1 style={{ fontSize: "24px", marginBottom: "20px", color: "#333" }}>
            {promptTitle || "Prompt"}
          </h1>

          <div style={{ marginBottom: "15px" }}>
            <strong>Type:</strong>{" "}
            {promptTypes.find((t) => t.value === promptType)?.label ||
              promptType}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <strong>Prompt Content:</strong>
            <div
              style={{
                marginTop: "10px",
                padding: "15px",
                backgroundColor: "#f5f5f5",
                borderRadius: "5px",
                whiteSpace: "pre-wrap",
                fontFamily: "monospace",
              }}
            >
              {promptContent}
            </div>
          </div>

          <div style={{ fontSize: "12px", color: "#666", marginTop: "30px" }}>
            Exported from PromptSmith
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptEditor;
