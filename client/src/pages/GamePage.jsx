import Game from "../components/Game.jsx";

function GamePage() {
  return (
    <>
      <div id="title">
        <img src="/penguins/Roald.png" />
        <img src="/logoACNH.webp" />
        <h1>Penguin Watching</h1>
      </div>
      <Game />
    </>
  );
}

export default GamePage;
