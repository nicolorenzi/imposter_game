function JoinLobbyPage({
  name,
  setName,
  roomCodeInput,
  setRoomCodeInput,
  onJoinLobby,
  onBack,
  isConnected,
  errorMessage,
  onClearError,
}) {
  const handleRoomCodeChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      setRoomCodeInput(value);
      onClearError?.();
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    onClearError?.();
  };

  const isFormReady = isConnected && name.trim().length > 0 && roomCodeInput.length === 4;
  const statusClass = isConnected ? "status-connected" : "status-disconnected";

  return (
    <main className="page-shell">
      <section className="page-card">
        <h1 className="page-title">Join Lobby</h1>
        <p className={`status-pill ${statusClass}`}>{isConnected ? "Connected" : "Connecting..."}</p>

        <div className="form-group">
          <label className="form-label">Your Name</label>
          <input
            className="input-field"
            placeholder="Enter your name"
            value={name}
            onChange={handleNameChange}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label">Room Code</label>
          <input
            className="input-field"
            type="text"
            inputMode="numeric"
            placeholder="0000"
            value={roomCodeInput}
            onChange={handleRoomCodeChange}
            maxLength={4}
            style={{ letterSpacing: "0.35em", textAlign: "center" }}
          />
          <p className="helper-text">(4-digit code)</p>
        </div>

        {errorMessage && (
          <p className="helper-text error-text">{errorMessage}</p>
        )}

        <div className="button-group">
          <button className="btn btn-primary" onClick={onJoinLobby} disabled={!isFormReady}>
            Join Lobby
          </button>
          <button className="btn btn-secondary" onClick={onBack}>
            Back
          </button>
        </div>
      </section>
    </main>
  );
}

export default JoinLobbyPage;
