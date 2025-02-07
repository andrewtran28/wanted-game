import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { GameProvider } from "./hooks/GameContext";
import Game from "./pages/Game";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/game"
            element={
              <GameProvider>
                <Game />
              </GameProvider>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
