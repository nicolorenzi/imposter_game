function HomePage({ onHostGame, onJoinGame, isConnected }) {
  const statusClass = isConnected ? "status-connected" : "status-disconnected";

  return (
    <main className="page-shell">
      <section className="page-card">
        <h1 className="page-title">Imposter Game</h1>
        <p className={`status-pill ${statusClass}`}>{isConnected ? "Connected" : "Connecting..."}</p>

        <div className="button-group">
          <button className="btn btn-primary" onClick={onHostGame} disabled={!isConnected}>
            Host Game
          </button>
          <button className="btn btn-secondary" onClick={onJoinGame} disabled={!isConnected}>
            Join Game
          </button>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
