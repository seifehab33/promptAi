import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
interface MarkdownEditorProps {
  content: string;
  onChange: (value: string) => void;
}

const MarkdownEditor = ({ content, onChange }: MarkdownEditorProps) => {
  const [activeTab, setActiveTab] = useState<string>("edit");

  return (
    <Card className="border">
      <Tabs
        defaultValue="edit"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="edit" className="p-0">
          <Textarea
            placeholder="Write your markdown here..."
            className="min-h-[200px] border-0 focus-visible:ring-0 rounded-t-none"
            value={content}
            onChange={(e) => onChange(e.target.value)}
          />
        </TabsContent>
        <TabsContent
          value="preview"
          className="p-4 min-h-[200px] prose prose-sm dark:prose-invert max-w-none"
        >
          {content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          ) : (
            <p className="text-muted-foreground italic">
              Preview will appear here
            </p>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default MarkdownEditor;
