function HomePage({ onHostGame, onJoinGame, isConnected }) {
  return (
    <div style={{ 
      padding: "40px", 
      maxWidth: "500px", 
      margin: "0 auto", 
      textAlign: "center",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }}>
      <h1 style={{ fontSize: "48px", marginBottom: "60px" }}>Imposter Game</h1>
      
      <div style={{ 
        marginBottom: "30px", 
        padding: "10px", 
        backgroundColor: isConnected ? "#d4edda" : "#f8d7da",
        borderRadius: "5px",
        fontSize: "14px"
      }}>
        {isConnected ? "✓ Connected" : "✗ Connecting..."}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <button 
          onClick={onHostGame}
          disabled={!isConnected}
          style={{ 
            padding: "20px 40px", 
            fontSize: "24px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: !isConnected ? "not-allowed" : "pointer",
            fontWeight: "bold",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          Host Game
        </button>

        <button 
          onClick={onJoinGame}
          disabled={!isConnected}
          style={{ 
            padding: "20px 40px", 
            fontSize: "24px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: !isConnected ? "not-allowed" : "pointer",
            fontWeight: "bold",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          Join Game
        </button>
      </div>
    </div>
  );
}

export default HomePage;