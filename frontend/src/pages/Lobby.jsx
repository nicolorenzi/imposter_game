function LobbyPage({ roomCode, players, onStartGame, onLeaveLobby, onToggleReady, isHost, currentPlayerName }) {
  // Check if all players are ready
  const allPlayersReady = players.length >= 2 && players.every(p => p.ready);
  
  // Find current player to show their ready status
  const currentPlayer = players.find(p => p.name === currentPlayerName);
  const isReady = currentPlayer?.ready || false;

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Lobby</h1>
      
      <div style={{ 
        backgroundColor: "#e7f3ff", 
        padding: "20px", 
        borderRadius: "10px",
        marginBottom: "30px",
        textAlign: "center"
      }}>
        <h2 style={{ margin: "0 0 10px 0", color: "#000000ff" }}>Room Code</h2>
        <div style={{ 
          fontSize: "36px", 
          fontWeight: "bold", 
          letterSpacing: "8px",
          color: "#000000ff"
        }}>
          {roomCode}
        </div>
      </div>

      <h2>Players ({players.length})</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {players.map((p, index) => (
          <li 
            key={`${p.name}-${index}`}
            style={{
              padding: "15px",
              marginBottom: "10px",
              backgroundColor: "#f8f9fa",
              borderRadius: "5px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center", 
              color: "#000000ff"
            }}
          >
            <span style={{ fontSize: "18px" }}>
              {p.name} {index === 0 && "(Host)"}
            </span>
            <span style={{ 
              fontSize: "14px",
              padding: "6px 12px",
              borderRadius: "5px",
              backgroundColor: p.ready ? "#28a745" : "#dc3545",
              color: "white",
              fontWeight: "bold"
            }}>
              {p.ready ? "✓ Ready" : "Not Ready"}
            </span>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <button 
          onClick={onToggleReady}
          style={{ 
            padding: "15px 30px", 
            fontSize: "18px",
            backgroundColor: isReady ? "#28a745" : "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          {isReady ? "✓ Ready" : "Not Ready"} (Click to toggle)
        </button>

        {isHost && (
          <button 
            onClick={onStartGame}
            disabled={!allPlayersReady}
            style={{ 
              padding: "15px 30px", 
              fontSize: "18px",
              backgroundColor: allPlayersReady ? "#007bff" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: allPlayersReady ? "pointer" : "not-allowed",
              fontWeight: "bold"
            }}
          >
            Start Game {!allPlayersReady && "(All players must be ready)"}
          </button>
        )}
        
        <button 
          onClick={onLeaveLobby}
          style={{ 
            padding: "15px 30px", 
            fontSize: "18px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Leave Lobby
        </button>
      </div>
    </div>
  );
}

export default LobbyPage;