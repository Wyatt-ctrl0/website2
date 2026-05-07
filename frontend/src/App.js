import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/App.css";
import LandingPage from "./pages/LandingPage";
import ThemePreview from "./pages/ThemePreview";

function App() {
  return (
    <div className="App app-shell">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/preview" element={<ThemePreview />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
