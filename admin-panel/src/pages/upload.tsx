import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { FileText, UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useRef, useState } from "react";
import { ScaleLoader } from "react-spinners";
import { useMutation } from "@tanstack/react-query";
import { uploadAndProcessFile } from "@/services/requests";

export default function Upload() {
  const uploadAndProcessMutation = useMutation({
    mutationFn: uploadAndProcessFile,
    onSuccess: (data) => {
      setFileProcessed(true);
      setTimeout(() => {
        setFileProcessed(false);
      }, 1000);
      console.log(data.message);
    },
  });
  const [selectedFile, setSelectedFile] = useState<File | null>();
  const [fileProcessed, setFileProcessed] = useState(false);

  const uploadInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUploadProcess = () => {
    if (!selectedFile) return;
    uploadAndProcessMutation.mutate(selectedFile);
  };
  return (
    <div className="container mx-auto py-4 flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Upload PDF for Processing
          </CardTitle>
          <CardDescription>
            Upload PDF files containing deliberations to extract and transform
            data into structured tables.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                setSelectedFile(e.dataTransfer.files[0]);
              }
            }}
          >
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <div className="mb-4 text-center">
              <p className="text-sm text-muted-foreground">
                Drag and drop your PDF file here, or click to browse
              </p>
            </div>
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              ref={uploadInputRef}
              onChange={handleFileChange}
            />
            <Button
              variant="outline"
              onClick={() => uploadInputRef.current?.click()}
              className="cursor-pointer"
            >
              Browse Files
            </Button>
          </div>
          {selectedFile && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium">Selected file:</p>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedFile.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedFile(null);
                    if (uploadInputRef.current) {
                      uploadInputRef.current.value = "";
                    }
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link to="/">Cancel</Link>
          </Button>
          <Button
            className="cursor-pointer"
            disabled={!selectedFile || uploadAndProcessMutation.isPending}
            onClick={() => handleFileUploadProcess()}
          >
            <ScaleLoader
              height={10}
              width={1}
              color="white"
              loading={uploadAndProcessMutation.isPending}
            />
            {!uploadAndProcessMutation.isPending && <UploadIcon />}
            Upload and Process
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
