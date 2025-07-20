import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import useCheckTokens from "@/api/useCheckTokens";
import { useMemo } from "react";

function PromptCheckTokens() {
  const { data: Tokens, isPending } = useCheckTokens();
  const checkUnlimitedTokens = useMemo(() => {
    if (Tokens?.tokensRemaining === 999999) {
      return "Unlimited Credits Remaining";
    }
    return `${Tokens?.tokensRemaining} Credits Remaining`;
  }, [Tokens]);
  return (
    <div className="flex items-center gap-2">
      {isPending ? (
        <Skeleton className="h-6 w-32 bg-gray-600" />
      ) : (
        <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400 text-white hover:from-purple-500/30 hover:to-pink-500/30">
          {checkUnlimitedTokens}
        </Badge>
      )}
    </div>
  );
}

export default PromptCheckTokens;
