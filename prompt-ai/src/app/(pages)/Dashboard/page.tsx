"use client";
import { useState } from "react";
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
import { Plus, Copy, Check } from "lucide-react";
import { useRouter } from "next/navigation";
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
const Dashboard = () => {
  const [prompt, setPrompt] = useState("");
  const [promptTitle, setPromptTitle] = useState("");
  const [context, setContext] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const router = useRouter();
  const {
    generatePrompt,
    responses,
    currentResponse,
    isStreaming,
    stopGeneration,
  } = useCreatePrompt();
  const { savePrompt, data: savedPrompt } = useSavePrompt();
  const [isPublic, setIsPublic] = useState(false);
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

    savePrompt({
      promptTitle: promptTitle,
      promptDescription:
        currentResponse || responses[responses.length - 1].text,
      promptContext: context,
      promptTags: [],
      isPublic: isPublic || false,
    });
    setContext("");
    setPromptTitle("");
    setIsPublic(false);
  };

  const handleGenerateResponse = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt before generating");
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
    setPrompt("");
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
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white dark:bg-promptsmith-dark border-b border-border py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-promptsmith-purple flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="ml-2 text-lg font-bold gradient-text">
              PromptSmith
            </span>
          </div>
          <Button variant="ghost" onClick={() => (window.location.href = "/")}>
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={() => router.push("/editor")}>
            <Plus className="mr-2 h-4 w-4" />
            New Prompt
          </Button>
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="create">Quick Prompt</TabsTrigger>
            <TabsTrigger value="library">Prompt Library</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Card className="h-full flex flex-col ">
                  <CardHeader className="flex justify-between  flex-row gap-4">
                    <div>
                      <CardTitle>Craft Your Prompt</CardTitle>
                      <CardDescription>
                        Write your prompt and provide context to get the best
                        results
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="space-y-2">
                        <label className="font-medium">Prompt Title</label>
                        <Input
                          placeholder="Enter your prompt title here..."
                          className="w-full"
                          value={promptTitle}
                          onChange={(e) => setPromptTitle(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="font-medium">Prompt</label>
                      <Textarea
                        placeholder="Enter your prompt here..."
                        className="min-h-32"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="font-medium">Context (Optional)</label>
                      <Textarea
                        placeholder="Add any additional context here..."
                        className="min-h-24"
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button
                      className="w-full"
                      onClick={handleGenerateResponse}
                      disabled={isStreaming}
                    >
                      {isStreaming ? "Generating..." : "Generate Response"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>
                      AI Response{" "}
                      <Badge
                        className={`${
                          isPublic
                            ? "bg-prompt-gradient text-clip"
                            : "bg-gray-800"
                        }`}
                      >
                        {isPublic ? "Public" : "Private"}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center justify-between">
                      See how the AI responds to your prompt
                      <div className="flex gap-2">
                        <Button
                          className="text-sm bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed   px-2 py-1 rounded-md "
                          onClick={handelSavePrompt}
                          disabled={currentResponse ? false : true}
                        >
                          Save Your Prompt
                        </Button>
                        <div className="w-fit flex items-center gap-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed bg-black text-white  hover:text-white">
                          {!isPublic && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="size-5 ml-2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                              />
                            </svg>
                          )}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className={`text-sm text-white `}>
                                {isPublic ? (
                                  <Button
                                    className="bg-black text-white hover:bg-black/80 hover:text-white disabled:opacity-50  disabled:cursor-not-allowed"
                                    onClick={handleBackToPrivate}
                                  >
                                    Back to Private
                                  </Button>
                                ) : (
                                  <Button
                                    className="bg-black text-white disabled:opacity-50  disabled:cursor-not-allowed hover:bg-black/80 hover:text-white"
                                    onClick={handleSharePrompt}
                                  >
                                    Share to Public Community
                                  </Button>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="bottom"
                              className="bg-black text-white"
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
                    <div className="bg-muted p-4 rounded-md h-[400px] border border-border overflow-y-auto">
                      {responses.length > 0 || currentResponse ? (
                        <div className="space-y-6">
                          {responses.map((response) => (
                            <div key={response.id} className="space-y-2">
                              <div className="bg-background p-3 rounded-md">
                                <p className="text-sm text-muted-foreground mb-2">
                                  Prompt: {response.prompt}
                                </p>
                                <p className="whitespace-pre-line flex ">
                                  <span className="w-12">
                                    <Image
                                      src={responseai}
                                      alt="response ai"
                                      className="  mr-2"
                                    />
                                  </span>
                                  <span className="text-sm">
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
                                className="text-muted-foreground hover:text-foreground"
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
                              <div className="bg-background p-3 rounded-md">
                                <p className="text-sm text-muted-foreground mb-2">
                                  Prompt: {prompt}
                                </p>
                                <p className="whitespace-pre-line">
                                  {currentResponse}
                                </p>
                                <div className="space-y-2 mt-2">
                                  <Skeleton className="h-4 w-[80%]" />
                                  <Skeleton className="h-4 w-[60%]" />
                                  <Skeleton className="h-4 w-[70%]" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-muted-foreground italic">
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
                        className="w-full"
                        onClick={stopGeneration}
                      >
                        Stop Generation
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={!savedPrompt}
                      onClick={() =>
                        router.push(`/editor/advanced/${savedPrompt.id}`)
                      }
                    >
                      Edit in Advanced Editor
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="library">
            <Card>
              <CardHeader>
                <CardTitle>Your Prompt Library</CardTitle>
                <CardDescription>
                  Access your saved prompts and templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-6">
                  <Input
                    placeholder="Search your prompts..."
                    className="max-w-md"
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
