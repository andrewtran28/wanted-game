import Game from "../components/Game";
import Leaderboard from "../components/Leaderboard";

function GamePage() {
  return (
    <div id="page">
      <div id="title">
        <img id="logo-penguin" src="/penguins/Roald.png" />
        <img id="logo-ac" src="/logoACNH.webp" />
        <h1>Penguin Watching</h1>
      </div>
      <div id="web-layout">
        <Game />
        <div className="right-cont">
          <Leaderboard />
          <div className="description">
            <p>
              Try to spot the target Penguin within the herd! Speed is everything as successful spots increases the
              timer and scoring, but be careful... Misclicks penalize your time!
            </p>
            <hr />
            <p>
              Assets are from the video game <em>Animal Crossing: New Horizons</em>.
            </p>
            <p>
              © 2025 <a href="https://github.com/andrewtran28/wanted-game">Penguin-Watching</a> by{" "}
              <a href="https://andrewtran-developer.netlify.app/">minglee</a>. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GamePage;
