import PageCard from "@/ux/page-card";
import { FileText, Key, Table } from "lucide-react";

const homeContent = [
  {
    id: 1,
    title: "Upload PDF",
    description: "Upload PDF files for processing",
    cta: "Upload PDF",
    icon: <FileText className="h-10 w-10 text-muted-foreground" />,
    route: "/upload",
  },
  {
    id: 2,
    title: "Manage Tables",
    description: "View and validate extracted tables",
    cta: "View Table",
    icon: <Table className="h-10 w-10 text-muted-foreground" />,
    route: "/tables",
  },
  {
    id: 3,
    title: "API Keys",
    description: "Manage API keys for data access",
    cta: "Manage Keys",
    icon: <Key className="h-10 w-10 text-muted-foreground" />,
    route: "/api-keys",
  },
];

export default function Home() {
  return (
    <div className="container mx-auto py-4 grid grid-cols-3 gap-4">
      {homeContent.map((content) => {
        return <PageCard content={content} key={content.id} />;
      })}
    </div>
  );
}
