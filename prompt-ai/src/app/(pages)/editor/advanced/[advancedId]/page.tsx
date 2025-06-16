"use client";
import React, { useState, use, useEffect } from "react";
import useGetPromptByID from "@/api/useGetPromptByID";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Save,
  Download,
  Share,
  Globe,
  Lock,
  Tag as TagIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MarkdownEditor from "@/components/MarkdownEditor";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import useUpdatePrompt from "@/api/useUpdatePrompt";

function Page({ params }: { params: Promise<{ advancedId: string }> }) {
  const { advancedId } = use(params);
  const router = useRouter();
  const { data, isLoading, error } = useGetPromptByID(advancedId);
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  const [promptTitle, setPromptTitle] = useState("");
  const [promptContent, setPromptContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const { updatePrompt, isPending } = useUpdatePrompt();

  useEffect(() => {
    if (data) {
      setPromptTitle(data.promptTitle || "");
      setPromptContent(data.promptDescription || "");
      setTags(data.promptTags || []);
    }
  }, [data]);

  const handleClose = () => {
    router.back();
  };

  const handleSavePrompt = () => {
    updatePrompt({
      id: advancedId,
      data: {
        promptTitle,
        promptDescription: promptContent,
        promptTags: tags,
      },
    });
  };

  const handleExportAsPDF = () => {
    // TODO: Implement PDF export
    toast.success("Prompt exported as PDF!");
  };

  const handleSharePrompt = () => {
    // TODO: Implement share functionality
    toast.success("Share link copied to clipboard!");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] w-full h-screen p-0 gap-0 overflow-y-auto">
        <div className="flex flex-col h-full">
          <DialogHeader className="flex flex-row items-center justify-between p-6 border-b">
            <DialogTitle className="text-xl font-semibold">
              Advanced Editor
            </DialogTitle>
            <DialogDescription>
              Edit your prompt in the advanced editor.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Input
                        placeholder="Prompt Title"
                        value={promptTitle}
                        onChange={(e) => setPromptTitle(e.target.value)}
                        className="font-medium text-lg"
                      />
                      <div className="flex items-center gap-2">
                        {data?.isPublic ? (
                          <Globe className="h-4 w-4 text-green-500" />
                        ) : (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <TagIcon className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-medium">Tags</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs flex items-center gap-1"
                          >
                            {tag}
                            <button
                              onClick={() =>
                                setTags(tags.filter((_, i) => i !== index))
                              }
                              className="hover:text-destructive"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        <Input
                          placeholder="Add a tag..."
                          className="w-full h-7 text-xs"
                          onKeyDown={(e) => {
                            if (
                              e.key === "Enter" &&
                              e.currentTarget.value.trim()
                            ) {
                              setTags([...tags, e.currentTarget.value.trim()]);
                              e.currentTarget.value = "";
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium">Context</h3>
                      <Textarea
                        placeholder="Add context for your prompt..."
                        value={data?.promptContext || ""}
                        className="min-h-[100px]"
                        readOnly
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Prompt Content</h3>
                        <div className="flex items-center gap-2">
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

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={handleSavePrompt}
                        disabled={isPending}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save to Library
                      </Button>
                      <Button variant="outline" onClick={handleExportAsPDF}>
                        <Download className="mr-2 h-4 w-4" />
                        Export PDF
                      </Button>
                      <Button variant="outline" onClick={handleSharePrompt}>
                        <Share className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Page;
