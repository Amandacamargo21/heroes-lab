import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HeroList from "./pages/HeroList";
import CreateHero from "./pages/CreateHero";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeroList />} />
        <Route path="/create" element={<CreateHero />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
