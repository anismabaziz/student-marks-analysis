import Dashboard from "./app/dashboard/page";
import { Analytics } from "@vercel/analytics/next";

export default function App() {
  return (
    <>
      <Dashboard />
      <Analytics />
    </>
  );
}
