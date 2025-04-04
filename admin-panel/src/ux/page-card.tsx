import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

interface PageCardProps {
  content: {
    title: string;
    description: string;
    cta: string;
    route: string;
    icon: React.ReactNode;
  };
}

export default function PageCard({
  content: { title, description, cta, route, icon },
}: PageCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-20 items-center justify-center">{icon}</div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link to={route}>{cta}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
