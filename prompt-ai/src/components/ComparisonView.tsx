import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, Grid2X2, LayoutList } from "lucide-react";

interface ComparisonViewProps {
  responses: string[];
}

const ComparisonView = ({ responses }: ComparisonViewProps) => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const handleCopyResponse = (response: string) => {
    navigator.clipboard.writeText(response);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {responses.length} responses generated
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={viewMode === "list" ? "bg-muted" : ""}
            onClick={() => setViewMode("list")}
          >
            <LayoutList className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={viewMode === "grid" ? "bg-muted" : ""}
            onClick={() => setViewMode("grid")}
          >
            <Grid2X2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="space-y-4">
          {responses.map((response, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">Response {index + 1}</h3>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleCopyResponse(response)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="whitespace-pre-line text-sm bg-muted p-4 rounded-md">
                  {response}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {responses.map((response, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">Response {index + 1}</h3>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleCopyResponse(response)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="whitespace-pre-line text-sm bg-muted p-4 rounded-md max-h-48 overflow-y-auto">
                  {response}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComparisonView;
