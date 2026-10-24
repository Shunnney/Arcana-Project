import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AllCards from "./pages/AllCards";
import CardDetail from "./pages/CardDetail";
import Reading from "./pages/Reading";
import Category from "./pages/Category";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="cards" element={<AllCards />} />
        <Route path="cards/:slug" element={<CardDetail />} />
        <Route path="reading" element={<Reading />} />
        <Route path="explore/:slug" element={<Category />} />
        <Route path="about/:slug" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
