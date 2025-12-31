function JoinLobbyPage({ name, setName, roomCodeInput, setRoomCodeInput, onJoinLobby, onBack, isConnected }) {
  const handleRoomCodeChange = (e) => {
    const value = e.target.value;
    // Only allow digits and max 4 characters
    if (/^\d{0,4}$/.test(value)) {
      setRoomCodeInput(value);
    }
  };

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
      <h1 style={{ fontSize: "48px", marginBottom: "60px" }}>Join Lobby</h1>
      
      <div style={{ 
        marginBottom: "30px", 
        padding: "10px", 
        backgroundColor: isConnected ? "#d4edda" : "#f8d7da",
        borderRadius: "5px",
        fontSize: "14px"
      }}>
        {isConnected ? "✓ Connected" : "✗ Connecting..."}
      </div>

      <div style={{ 
        marginBottom: "30px",
        textAlign: "left"
      }}>
        <label style={{ 
          display: "block", 
          marginBottom: "10px", 
          fontSize: "18px", 
          fontWeight: "bold",
          textAlign: "center"
        }}>
          Your Name
        </label>
        <input
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          style={{ 
            padding: "15px", 
            fontSize: "18px", 
            width: "100%",
            borderRadius: "8px",
            border: "2px solid #ddd",
            boxSizing: "border-box"
          }}
        />
      </div>

      <div style={{ 
        marginBottom: "40px",
        textAlign: "left"
      }}>
        <label style={{ 
          display: "block", 
          marginBottom: "10px", 
          fontSize: "18px", 
          fontWeight: "bold",
          textAlign: "center"
        }}>
          Room Code
        </label>
        <input
          type="text"
          inputMode="numeric"
          placeholder="0000"
          value={roomCodeInput}
          onChange={handleRoomCodeChange}
          maxLength={4}
          style={{ 
            padding: "15px", 
            fontSize: "32px", 
            width: "100%",
            borderRadius: "8px",
            border: "2px solid #ddd",
            boxSizing: "border-box",
            textAlign: "center",
            letterSpacing: "2px",
            fontWeight: "bold"
          }}
        />
        <p style={{ 
          fontSize: "14px", 
          color: "#666", 
          marginTop: "8px",
          textAlign: "center"
        }}>
          (4-digit code)
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <button 
          onClick={onJoinLobby}
          disabled={!isConnected || !name.trim() || roomCodeInput.length !== 4}
          style={{ 
            padding: "20px 40px", 
            fontSize: "24px",
            backgroundColor: (!isConnected || !name.trim() || roomCodeInput.length !== 4) ? "#ccc" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: (!isConnected || !name.trim() || roomCodeInput.length !== 4) ? "not-allowed" : "pointer",
            fontWeight: "bold",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          Join Lobby
        </button>

        <button 
          onClick={onBack}
          style={{ 
            padding: "15px 30px", 
            fontSize: "18px",
            backgroundColor: "transparent",
            color: "#666",
            border: "2px solid #ddd",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

export default JoinLobbyPage;