"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tag,
  Bookmark,
  BookmarkPlus,
  Star,
  Copy,
  Download,
  Share,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import MarkdownEditor from "@/components/MarkdownEditor";
import TagInput from "@/components/TagInput";
import ComparisonView from "@/components/ComparisonView";
import { useRouter } from "next/navigation";
const promptTypes = [
  { value: "chat", label: "Chat Prompt" },
  { value: "image", label: "Image Prompt" },
  { value: "code", label: "Code Prompt" },
  { value: "writing", label: "Writing Prompt" },
  { value: "other", label: "Other" },
];

const PromptEditor = () => {
  const [promptTitle, setPromptTitle] = useState("");
  const [promptContent, setPromptContent] = useState("");
  const [promptType, setPromptType] = useState("chat");
  const [tags, setTags] = useState<string[]>([]);
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<string[]>([]);
  const router = useRouter();

  const handleGenerateResponse = async () => {
    if (!promptContent.trim()) {
      toast.error("Please enter a prompt before generating");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate multiple API calls with setTimeout
      const mockResponses = [
        "This is the first response to your prompt. In a real application, this would come from an AI API like OpenAI's GPT, Anthropic's Claude, or similar services.",
        "This is the second response with slightly different parameters. Notice how changing parameters can affect the output quality and style.",
        "This is the third response from a different model. Different AI models may have different strengths and weaknesses for various types of prompts.",
      ];

      setTimeout(() => {
        setResponses(mockResponses);

        toast.success("Multiple responses have been generated for comparison.");

        setIsLoading(false);
      }, 1500);
    } catch (error) {
      toast.error(`Failed to generate responses. Please try again. ${error}`);
      setIsLoading(false);
    }
  };

  const handleSavePrompt = () => {
    // In a real app, this would save to a database
    toast.success("Your prompt has been saved to your library.");
  };

  const handleExportAsPDF = () => {
    // In a real app, this would generate a PDF
    toast.success("Your prompt has been exported as a PDF file.");
  };

  const handleExportAsImage = () => {
    // In a real app, this would capture the content as an image
    toast.success("Your prompt has been exported as an image file.");
  };

  const handleSharePrompt = () => {
    // In a real app, this would generate a shareable link
    toast.success("A shareable link has been copied to your clipboard.");
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptContent);
    toast.success("The prompt has been copied to your clipboard.");
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
          <Button variant="ghost" onClick={() => router.push("/Dashboard")}>
            Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Prompt Editor</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Input
                    placeholder="Prompt Title"
                    value={promptTitle}
                    onChange={(e) => setPromptTitle(e.target.value)}
                    className="font-medium text-lg"
                  />

                  <div className="flex items-center gap-4">
                    <div className="w-full max-w-xs">
                      <Select value={promptType} onValueChange={setPromptType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {promptTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsPublic(!isPublic)}
                        className={isPublic ? "bg-accent" : ""}
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className={isBookmarked ? "bg-accent" : ""}
                      >
                        {isBookmarked ? (
                          <Bookmark className="h-4 w-4" />
                        ) : (
                          <BookmarkPlus className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsLiked(!isLiked)}
                        className={isLiked ? "bg-accent" : ""}
                      >
                        <Star
                          className="h-4 w-4"
                          fill={isLiked ? "currentColor" : "none"}
                        />
                      </Button>
                    </div>
                  </div>

                  <TagInput tags={tags} setTags={setTags} />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={!isMarkdownMode ? "bg-muted" : ""}
                          onClick={() => setIsMarkdownMode(false)}
                        >
                          Plain Text
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={isMarkdownMode ? "bg-muted" : ""}
                          onClick={() => setIsMarkdownMode(true)}
                        >
                          Markdown
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleCopyPrompt}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {isMarkdownMode ? (
                      <MarkdownEditor
                        content={promptContent}
                        onChange={setPromptContent}
                      />
                    ) : (
                      <Textarea
                        placeholder="Write your prompt here..."
                        className="min-h-[200px]"
                        value={promptContent}
                        onChange={(e) => setPromptContent(e.target.value)}
                      />
                    )}
                  </div>

                  <div className="flex justify-between">
                    <Button
                      onClick={handleGenerateResponse}
                      disabled={isLoading || !promptContent.trim()}
                    >
                      {isLoading ? "Generating..." : "Generate Responses"}
                    </Button>

                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleSavePrompt}>
                        <Save className="mr-2 h-4 w-4" />
                        Save to Library
                      </Button>
                      <Button variant="outline" onClick={handleExportAsPDF}>
                        <Download className="mr-2 h-4 w-4" />
                        Export PDF
                      </Button>
                      <Button variant="outline" onClick={handleExportAsImage}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Image
                      </Button>
                      <Button variant="outline" onClick={handleSharePrompt}>
                        <Share className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {responses.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Response Comparison</h2>
                <ComparisonView responses={responses} />
              </div>
            )}
          </div>

          <div>
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">
                  Public Prompt Library
                </h2>
                <p className="text-muted-foreground mb-4">
                  Browse popular prompts from the community or share your own
                  prompts with others.
                </p>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <Card
                      key={item}
                      className="p-3 hover:bg-muted/50 cursor-pointer"
                    >
                      <div className="font-medium">Sample Prompt {item}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        A brief description of this community prompt...
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Tag className="h-3 w-3" />
                        <span>chat, writing</span>
                        <span className="ml-auto flex items-center">
                          <Star className="h-3 w-3 mr-1" fill="currentColor" />
                          {Math.floor(Math.random() * 100) + 5}
                        </span>
                      </div>
                    </Card>
                  ))}
                  <Button variant="outline" className="w-full">
                    Browse Library
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PromptEditor;
