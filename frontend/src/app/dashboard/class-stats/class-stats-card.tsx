import { Card, CardContent } from "@/components/ui/card";

interface ClassStatsCardProps {
  metric: string;
  value: number;
  quality: string;
}
export default function ClassStatsCard({
  metric,
  value,
  quality,
}: ClassStatsCardProps) {
  return (
    <Card className="w-full">
      <CardContent className="">
        <p className="text-sm font-semibold">{metric}</p>
        <h2 className="text-3xl font-bold mb-2">{`${value}${
          metric == "Passing" ? "%" : ""
        }`}</h2>
        <p className="text-sm text-[#71727b]">{quality}</p>
      </CardContent>
    </Card>
  );
}
