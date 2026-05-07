import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/App.css";
import LandingPage from "./pages/LandingPage";
import ThemePreview from "./pages/ThemePreview";
import ProductDetail from "./pages/ProductDetail";
import DogStory from "./pages/DogStory";

function App() {
  return (
    <div className="App app-shell">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/preview" element={<ThemePreview />} />
          <Route path="/preview/product/:slug" element={<ProductDetail />} />
          <Route path="/preview/dog/:slug" element={<DogStory />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
