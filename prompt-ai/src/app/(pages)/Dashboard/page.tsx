"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Copy, Check, Sparkles, Zap, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import useCreatePrompt from "@/api/useCreatePrompt";
import useSavePrompt from "@/api/useSavePrompt";
import PromptLibrary from "@/components/PromptLibrary/PromptLibrary";
import { Skeleton } from "@/components/ui/skeleton";
import useDebounce from "@/hooks/useDebounce";
import responseai from "@/assets/images/response ai.svg";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import AuthNav from "@/components/AuthNav/AuthNav";
import useCheckTokens from "@/api/useCheckTokens";
import PromptCheckTokens from "@/components/prompts/promptCheckTokens";

const Dashboard = () => {
  const [prompt, setPrompt] = useState("");
  const [promptTitle, setPromptTitle] = useState("");
  const [context, setContext] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { data: Tokens, isPending } = useCheckTokens();
  const router = useRouter();
  const {
    generatePrompt,
    responses,
    currentResponse,
    isStreaming,
    stopGeneration,
  } = useCreatePrompt("gpt-4o-mini");
  const { savePrompt, data: savedPrompt } = useSavePrompt();
  const [isPublic, setIsPublic] = useState(false);
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "create";
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

  const handelSavePrompt = () => {
    if (!responses.length && !currentResponse) {
      toast.error("Please generate a response before saving");
      return;
    }

    if (!promptTitle.trim()) {
      toast.error("Please enter a prompt title");
      return;
    }

    const allResponses = [
      ...responses.map((response) => response.text),
      ...(currentResponse ? [currentResponse] : []),
    ];

    const combinedDescription = allResponses.join("\n\n---\n\n");

    savePrompt({
      promptContent: prompt,
      promptTitle: promptTitle,
      promptDescription: combinedDescription,
      promptContext: context,
      promptTags: [],
      isPublic: isPublic || false,
      promptModel: "gpt-4o-mini",
    });
    setPromptTitle("");
    setPrompt("");
    setContext("");
    setIsPublic(false);
  };
  const checkTokens = () => {
    if (Tokens?.tokensRemaining && Tokens.tokensRemaining <= 0) {
      toast.error(Tokens.message);
      return false;
    } else {
      toast.success(Tokens?.message);
      return true;
    }
  };
  const handleGenerateResponse = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt before generating");
      return;
    }

    const hasTokens = checkTokens();
    if (!hasTokens) {
      return;
    }

    generatePrompt({
      prompt: prompt,
      context: context || undefined,
    });

    toast.info(
      "Click on Save Your Prompt to save your prompt and call it later",
      {
        duration: 3000,
      }
    );
  };

  const handleSharePrompt = () => {
    if (!responses.length && !currentResponse) {
      toast.error("Please generate a response before sharing");
      return;
    }
    setIsPublic(!isPublic);
    toast.success(
      "Prompt shared successfully , Please Click on Save Your Prompt to save your prompt and call it later",
      {
        duration: 5000,
        style: {
          backgroundColor: "green",
          color: "white",
        },
      }
    );
  };

  const handleBackToPrivate = () => {
    setIsPublic(false);
    toast.success(
      "Prompt back to private successfully , Please Click on Save Your Prompt to save your prompt and call it later",
      {
        duration: 5000,
        style: {
          backgroundColor: "green",
          color: "white",
        },
      }
    );
  };

  const isGenerateButtonDisabled = useMemo(() => {
    return (
      isStreaming ||
      isPending ||
      (Tokens?.tokensRemaining !== undefined && Tokens.tokensRemaining <= 0)
    );
  }, [isStreaming, isPending, Tokens]);

  const getGenerateButtonText = useMemo(() => {
    if (isStreaming) return "Generating...";
    if (Tokens?.tokensRemaining !== undefined && Tokens.tokensRemaining == 0)
      return "No Credits Available";
    return "Generate Response";
  }, [isStreaming, Tokens]);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <AuthNav />

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-300 text-lg">
              Create, manage, and organize your AI prompts
            </p>
          </div>
          <Button
            onClick={() => router.push("/editor")}
            className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400 text-white hover:from-purple-500/30 hover:to-pink-500/30"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Prompt
          </Button>
        </div>

        <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-6 bg-white/10 backdrop-blur-md border-white/20">
            <TabsTrigger
              value="create"
              className="text-white data-[state=active]:bg-purple-500/20 data-[state=active]:border-purple-400"
            >
              Quick Prompt
            </TabsTrigger>
            <TabsTrigger
              value="library"
              className="text-white data-[state=active]:bg-purple-500/20 data-[state=active]:border-purple-400"
            >
              Prompt Library
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <Card className="h-full flex flex-col bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
                  <CardHeader className="flex justify-between flex-row gap-4">
                    <div>
                      <CardTitle className="text-white text-xl">
                        Craft Your Prompt
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        Write your prompt and provide context to get the best
                        results
                      </CardDescription>
                    </div>
                    <PromptCheckTokens />
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                          Prompt Title
                        </label>
                        <Input
                          placeholder="Enter your prompt title here..."
                          className="w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400"
                          value={promptTitle}
                          onChange={(e) => setPromptTitle(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Prompt
                      </label>
                      <Textarea
                        placeholder="Enter your prompt here..."
                        className="min-h-32 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 resize-none"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Context (Optional)
                      </label>
                      <Textarea
                        placeholder="Add any additional context here..."
                        className="min-h-24 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 resize-none"
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button
                      className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400 text-white hover:from-purple-500/30 hover:to-pink-500/30"
                      onClick={handleGenerateResponse}
                      disabled={isGenerateButtonDisabled}
                    >
                      {getGenerateButtonText}
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div>
                <Card className="h-full bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-purple-400" />
                        <CardTitle className="text-white text-xl">
                          AI Response
                        </CardTitle>
                      </div>
                      <Badge
                        className={`${
                          isPublic
                            ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400 text-green-200"
                            : "bg-gray-800/50 border-gray-600 text-gray-300"
                        }`}
                      >
                        {isPublic ? "Public" : "Private"}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-300 flex items-center justify-between">
                      See how the AI responds to your prompt
                      <div className="flex gap-2">
                        <Button
                          className="text-sm bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400 text-white hover:from-purple-500/30 hover:to-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded-md"
                          onClick={handelSavePrompt}
                          disabled={currentResponse ? false : true}
                        >
                          Save Your Prompt
                        </Button>
                        <div className="w-fit flex items-center gap-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-sm text-white">
                                {isPublic ? (
                                  <Button
                                    className="bg-gradient-to-r from-gray-600/20 to-gray-700/20 border-gray-500 text-white hover:from-gray-600/30 hover:to-gray-700/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handleBackToPrivate}
                                  >
                                    Back to Private
                                  </Button>
                                ) : (
                                  <Button
                                    className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-400 text-white hover:from-blue-500/30 hover:to-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handleSharePrompt}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth="1.5"
                                      stroke="currentColor"
                                      className="size-5 text-white"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                                      />
                                    </svg>
                                    Share to Public Community
                                  </Button>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="bottom"
                              className="bg-gray-800 border-gray-600 text-white"
                            >
                              <p className="text-sm">
                                Share your prompt with the public community by
                                default its private.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-800/50 p-4 rounded-md h-[400px] border border-white/20 overflow-y-auto">
                      {responses.length > 0 || currentResponse ? (
                        <div className="space-y-6">
                          {responses.map((response) => (
                            <div key={response.id} className="space-y-2">
                              <div className="bg-gray-700/50 p-3 rounded-md border border-gray-600">
                                <p className="text-sm text-gray-300 mb-2">
                                  Prompt: {response.prompt}
                                </p>
                                <p className="whitespace-pre-line flex">
                                  <span className="w-12">
                                    <Image
                                      src={responseai}
                                      alt="response ai"
                                      className="mr-2"
                                    />
                                  </span>
                                  <span className="text-sm text-white">
                                    {response.text}
                                  </span>
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleCopy(response.text, response.id)
                                }
                                className="text-gray-300 hover:text-white hover:bg-gray-700/50"
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
                          {isStreaming && (
                            <div className="space-y-2">
                              <div className="bg-gray-700/50 p-3 rounded-md border border-gray-600">
                                <p className="text-sm text-gray-300 mb-2">
                                  Prompt: {prompt}
                                </p>
                                <p className="whitespace-pre-line text-white">
                                  {currentResponse}
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
                          {isStreaming
                            ? "Generating response..."
                            : "Response will appear here"}
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    {isStreaming && (
                      <Button
                        variant="destructive"
                        className="w-full bg-red-600 hover:bg-red-700"
                        onClick={stopGeneration}
                      >
                        Stop Generation
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="w-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-400 text-white hover:from-blue-500/30 hover:to-cyan-500/30"
                      disabled={!savedPrompt}
                      onClick={() =>
                        router.push(`/editor/advanced/${savedPrompt.id}`)
                      }
                    >
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Edit in Advanced Editor
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="library">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">
                    Your Prompt Library
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-300">
                  Access your saved prompts and templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-6">
                  <Input
                    placeholder="Search your prompts..."
                    className="max-w-md bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <PromptLibrary search={debouncedSearch} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
