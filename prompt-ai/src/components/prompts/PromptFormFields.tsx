import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tag } from "lucide-react";
import TagInput from "@/components/TagInput";
import { PromptFormFieldsProps } from "@/types/type";

const PromptFormFields: React.FC<PromptFormFieldsProps> = ({
  promptTitle,
  setPromptTitle,
  promptContext,
  setPromptContext,
  tags,
  setTags,
  isPublic,
  setIsPublic,
  showTitle = true,
  showContext = true,
  showTags = true,
  showPublicToggle = true,
  className = "",
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {showTitle && (
        <div className="space-y-2">
          <Label
            htmlFor="promptTitle"
            className="text-sm font-medium text-gray-300"
          >
            Prompt Title
          </Label>
          <Input
            id="promptTitle"
            placeholder="Enter a descriptive title..."
            value={promptTitle}
            onChange={(e) => setPromptTitle(e.target.value)}
            className="font-medium text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400"
          />
        </div>
      )}

      {showContext && (
        <div className="space-y-2">
          <Label
            htmlFor="promptContext"
            className="text-sm font-medium text-gray-300"
          >
            Prompt Context
          </Label>
          <Textarea
            id="promptContext"
            placeholder="Enter a descriptive context..."
            value={promptContext}
            onChange={(e) => setPromptContext(e.target.value)}
            className="font-medium text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 resize-none"
          />
        </div>
      )}

      {showTags && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Tag className="h-4 w-4 text-white" />
            </div>
            Tags
          </div>
          <TagInput tags={tags} setTags={setTags} />
        </div>
      )}

      {showPublicToggle && (
        <div className="flex items-center space-x-2">
          <Switch
            id="isPublic"
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
          <Label
            htmlFor="isPublic"
            className="text-sm font-medium text-gray-300"
          >
            Make this prompt public
          </Label>
        </div>
      )}
    </div>
  );
};

export default PromptFormFields;
