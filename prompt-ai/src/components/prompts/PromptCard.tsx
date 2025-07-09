import { PublicPrompt } from "@/types/type";
import useGetLikes from "@/api/useGetLikes";
import { formatDate } from "@/lib/utils";
import { Clock, Copy, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import person from "@/assets/images/unknown-person.png";

function PromptCard({
  prompt,
  userName,
  onLike,
  onCopy,
  showMoreStates,
  onToggleShowMore,
}: {
  prompt: PublicPrompt;
  userName?: string;
  onLike: (promptId: string) => void;
  onCopy: (description: string) => void;
  showMoreStates: { [key: string]: boolean };
  onToggleShowMore: (promptId: string) => void;
}) {
  const { likesData } = useGetLikes(Number(prompt.id));
  return (
    <div className="person-prompt max-h-fit bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg max-w-2xl p-3">
      <div className="person-info flex items-center justify-between">
        <div className="person-name flex items-center gap-2">
          <Image
            src={person}
            alt="person"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="person-name-info text-white text-sm">
            <p className="font-bold text-xl capitalize">
              {prompt.user.name === userName ? "You" : prompt.user.name}
            </p>
            <p className="text-gray-500 text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />{" "}
              <span>{formatDate(prompt.createdAt)}</span>
            </p>
          </div>
        </div>
      </div>
      <hr className="my-2 border-t border-gray-600" />
      <div className="person-prompt-itself mt-3 mb-5">
        <div className="person-prompt-title mb-8">
          <p className="text-white text-sm capitalize">
            <span className="font-bold">Title : </span>
            {prompt.promptTitle}
          </p>
        </div>
        <div className="person-prompt-content">
          <div className="text-white text-sm">
            <div className="flex items-center gap-2 justify-between">
              <span className="font-bold">Content : </span>{" "}
              <Tooltip>
                <TooltipTrigger
                  asChild
                  onClick={() => onCopy(prompt.promptDescription)}
                >
                  <Copy className="w-4 h-4 cursor-pointer" color="white" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-white text-sm">Copy</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <span
              className={`${
                showMoreStates[String(prompt.id)]
                  ? "line-clamp-none whitespace-pre-wrap"
                  : "line-clamp-3"
              }`}
            >
              {prompt.promptDescription}
            </span>
            {prompt.promptDescription.length > 100 && (
              <span
                className="text-gray-200   text-bold cursor-pointer text-sm"
                onClick={() => onToggleShowMore(String(prompt.id))}
              >
                {showMoreStates[String(prompt.id)]
                  ? "Read Less..."
                  : "Read More..."}
              </span>
            )}
          </div>
        </div>
      </div>
      <div
        className="
   prompt-tags mb-5 flex items-center gap-2 *:bg-promptsmith-purple *:px-2 *:w-fit *:text-white *:rounded-xl *:text-sm"
      >
        {prompt.promptTags.map((tag: string) => (
          <p key={tag}>{tag}</p>
        ))}
        {prompt.promptTags.length === 0 && <p>No Tags</p>}
      </div>
      <hr className="my-2 border-t border-gray-600" />
      <div className="like-prompt flex items-center justify-between">
        <div className="like-prompt-info flex items-center gap-2">
          <ThumbsUp
            className="w-4 h-4 cursor-pointer"
            color="white"
            onClick={() => onLike(prompt.id)}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-white text-sm cursor-pointer">
                {prompt.likes?.length || 0} Likes
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-white text-sm">
                {likesData?.likes && likesData.likes.length > 0 ? (
                  <div>
                    <p className="font-bold mb-1">Liked by:</p>
                    <div className="max-h-32 overflow-y-auto">
                      {likesData.likes.map((like: string, index: number) => (
                        <p key={index} className="text-xs">
                          {like} {like === userName ? "(You)" : ""}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p>No likes yet</p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
export default PromptCard;
