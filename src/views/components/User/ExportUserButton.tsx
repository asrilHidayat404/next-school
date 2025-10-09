import React from "react";
import { Button } from "../ui/button";
import { Download } from "lucide-react";

const ExportUserButton = ({ query }: { query?: string }) => {
  const href = `/api/users/export${query ? "?query=" + query : ""}`;

  return (
    <a href={href} download>
      <Button variant="outline" size="sm" className="flex items-center gap-2 cursor-pointer">
        <Download className="h-4 w-4" />
        Export
      </Button>
    </a>
  );
};

export default ExportUserButton;
