function Game({ gameData, roomCode, players, onBackToLobby, onRevealImposter }) {
  if (!gameData) {
    return (
      <main className="page-shell">
        <section className="page-card">
          <h1 className="page-title">Game in Progress</h1>
          <p className="helper-text">Waiting on the server to assign roles...</p>
        </section>
      </main>
    );
  }

  const categoryLabel = `${gameData.category.charAt(0).toUpperCase()}${gameData.category.slice(1)}`;
  const roleHint = gameData.is_imposter
    ? "You are the imposter. Stay calm and blend in."
    : "You have the word. Keep descriptions clever without revealing it.";

  return (
    <main className="page-shell">
      <section className="page-card">
        <h1 className="page-title">Round In Progress</h1>
        <div className="game-card">
          <p className="game-detail">Category · {categoryLabel}</p>
          <div className="game-word">{gameData.word}</div>
          <p className="game-detail">
            <strong>{gameData.starter}</strong> will go first. {roleHint}
          </p>

          <div className="game-actions">
            {gameData.is_host && (
              <button className="btn btn-primary" onClick={onRevealImposter}>
                Reveal Imposter
              </button>
            )}
            <button className="btn btn-secondary" onClick={onBackToLobby}>
              Back to Lobby
            </button>
          </div>
        </div>

        <p className="player-list-title">Players ({players.length})</p>
        <ul className="player-list">
          {players.map((p, index) => (
            <li key={index} className="player-row">
              <span className="player-name">{p.name}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Game;
