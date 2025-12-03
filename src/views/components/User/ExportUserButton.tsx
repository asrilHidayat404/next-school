import React from "react";
import { Button } from "../ui/button";
import { Download } from "lucide-react";

const ExportButton = ({ url, label }: { label: string; url: string }) => {

  return (
    <a href={url} download>
      <Button variant="outline" size="sm" className="flex items-center gap-2 cursor-pointer">
        <Download className="h-4 w-4" />
        {label}
      </Button>
    </a>
  );
};

export default ExportButton;
