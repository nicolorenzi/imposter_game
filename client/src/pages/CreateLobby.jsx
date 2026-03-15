function CreateLobby({ name, setName, maxPlayers, setMaxPlayers, onCreateLobby, onBack, isConnected }) {
  const isFormValid =
    isConnected && name.trim().length > 0 && Number(maxPlayers) >= 2 && Number(maxPlayers) <= 10;

  return (
    <main className="page-shell">
      <section className="page-card">
        <h1 className="page-title">Create Lobby</h1>
        <p className={`status-pill ${isConnected ? "status-connected" : "status-disconnected"}`}>
          {isConnected ? "Connected" : "Connecting..."}
        </p>

        <div className="form-group">
          <label className="form-label">Your Name</label>
          <input
            className="input-field"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label">Max Players</label>
          <input
            className="input-field"
            type="number"
            min="2"
            max="10"
            placeholder="2-10"
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(e.target.value)}
          />
          <p className="helper-text">(Between 2-10 players)</p>
        </div>

        <div className="button-group">
          <button className="btn btn-primary" onClick={onCreateLobby} disabled={!isFormValid}>
            Create Lobby
          </button>
          <button className="btn btn-secondary" onClick={onBack}>
            Back
          </button>
        </div>
      </section>
    </main>
  );
}

export default CreateLobby;
