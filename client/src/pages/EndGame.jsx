function EndGame({ imposter, word, onReturnToLobby }) {
  return (
    <main className="page-shell">
      <section className="page-card">
        <h1 className="page-title">Game Over</h1>
        <div className="endgame-card">
          <p className="endgame-subtitle">The Imposter Was</p>
          <p className="endgame-word">{imposter}</p>
          <p className="game-detail">
            The revelation word was <strong>{word}</strong>.
          </p>
        </div>

        <div className="button-group">
          <button className="btn btn-primary" onClick={onReturnToLobby}>
            Return to Lobby
          </button>
        </div>
        <p className="secondary-link">Ready to challenge the next guise? Reset the room when everyone is set.</p>
      </section>
    </main>
  );
}

export default EndGame;
