import Navbar from "@/ux/navbar";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}
