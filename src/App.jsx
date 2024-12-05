import React from "react";
import { Routes, Route } from "react-router-dom";
import PlayerSetup from "./PlayerSetup";
import GamePage from "./GamePage";
import Home from "./home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/setup" element={<PlayerSetup />} />
      <Route path="/game" element={<GamePage />} />
    </Routes>
  );
}

export default App;
