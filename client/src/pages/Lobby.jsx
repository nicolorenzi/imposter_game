function LobbyPage({ roomCode, players, onStartGame, onLeaveLobby, onToggleReady, isHost, currentPlayerName }) {
  const allPlayersReady = players.length >= 2 && players.every((p) => p.ready);
  const currentPlayer = players.find((p) => p.name === currentPlayerName);
  const isReady = currentPlayer?.ready || false;

  return (
    <main className="page-shell">
      <section className="page-card">
        <h1 className="page-title">Lobby</h1>
        <div className="room-code-card">
          <p className="room-code-label">Room Code</p>
          <div className="room-code-value">{roomCode}</div>
        </div>

        <p className="player-list-title">Players ({players.length})</p>
        <ul className="player-list">
          {players.map((p, index) => (
            <li key={`${p.name}-${index}`} className="player-row">
              <span className="player-name">
                {p.name}
                {index === 0 && " (Host)"}
              </span>
              <span className={`player-status ${p.ready ? "status-ready" : "status-waiting"}`}>
                {p.ready ? "Ready" : "Waiting"}
              </span>
            </li>
          ))}
        </ul>

        <div className="game-actions">
          <button
            className={`btn ${isReady ? "btn-primary" : "btn-muted"}`}
            onClick={onToggleReady}
          >
            {isReady ? "Not Ready" : "Ready"}
          </button>
          {isHost && (
            <button className="btn btn-primary" onClick={onStartGame} disabled={!allPlayersReady}>
              Start Game
            </button>
          )}
          <button className="btn btn-secondary" onClick={onLeaveLobby}>
            Leave Lobby
          </button>
        </div>
        {!allPlayersReady && (
          <p className="helper-text">
            Every player must be ready before the host can start the round.
          </p>
        )}
      </section>
    </main>
  );
}

export default LobbyPage;
