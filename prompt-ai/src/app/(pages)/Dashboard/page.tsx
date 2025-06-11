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
import { Plus, Trash2, Copy, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useCreatePrompt from "@/api/useCreatePrompt";
import useSavePrompt from "@/api/useSavePrompt";
import PromptLibrary from "@/components/PromptLibrary/PromptLibrary";
import { Skeleton } from "@/components/ui/skeleton";
import useDebounce from "@/hooks/useDebounce";

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
    clearText,
  } = useCreatePrompt();
  const { savePrompt } = useSavePrompt();

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
      isPublic: false,
    });
    setContext("");
    setPromptTitle("");
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
                  <CardHeader>
                    <CardTitle>Craft Your Prompt</CardTitle>
                    <CardDescription>
                      Write your prompt and provide context to get the best
                      results
                    </CardDescription>
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
                    <CardTitle>AI Response</CardTitle>
                    <CardDescription className="flex items-center justify-between">
                      See how the AI responds to your prompt
                      <div className="flex gap-2">
                        <button
                          className="text-sm bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed   px-2 py-1 rounded-md text-muted-foreground"
                          onClick={handelSavePrompt}
                          disabled={currentResponse ? false : true}
                        >
                          Save Your Prompt
                        </button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearText}
                          className="text-red-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed "
                          disabled={currentResponse ? false : true}
                        >
                          <Trash2 className="h-4 w-4 disabled:opacity-50 disabled:cursor-not-allowed" />
                        </Button>
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
                                <p className="whitespace-pre-line">
                                  {response.text}
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
                      disabled={!responses.length && !currentResponse}
                      onClick={() => router.push("/editor")}
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
