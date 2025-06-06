import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { ArrowLeft, Plus } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ApiKeys() {
  return (
    <div>
      {/* Navbar */}
      <div className="py-4 border-b border">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={"ghost"}
              size={"lg"}
              className="cursor-pointer"
              asChild
            >
              <Link to="/">
                <ArrowLeft />
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold">API Keys</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto py-4">
        <Card>
          <CardHeader className="flex items-end justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">API Keys</CardTitle>
              <CardDescription>
                Manage API keys for accessing the processed data
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size={"lg"}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create API Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New API Key</DialogTitle>
                  <DialogDescription>
                    Generate a new API key to access the data programmatically.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                  <Label>API Key Name</Label>
                  <Input placeholder="e.g., Production API Key" />
                </div>
                <DialogFooter>
                  <Button>Generate Key</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
