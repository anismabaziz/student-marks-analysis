import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <div className="py-4 border-b border">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Students Analysis Admin</h1>
        <Button className="cursor-pointer">Logout</Button>
      </div>
    </div>
  );
}
