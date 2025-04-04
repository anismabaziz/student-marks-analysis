import { Routes, Route } from "react-router";
import Layout from "./pages/layout";
import Tables from "./pages/tables";
import ApiKeys from "./pages/api-keys";
import Home from "./pages/home";
import Upload from "./pages/upload";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="tables" element={<Tables />} />
        <Route path="api-keys" element={<ApiKeys />} />
        <Route path="upload" element={<Upload />} />
      </Route>
    </Routes>
  );
}
