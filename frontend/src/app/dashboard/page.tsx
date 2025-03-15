import ClassStats from "./class-stats";

export default function Dashboard() {
  return (
    <div className="container mx-auto py-10 space-y-5">
      <h1 className="text-3xl font-bold">Student Grades Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <ClassStats />
      </div>
    </div>
  );
}
