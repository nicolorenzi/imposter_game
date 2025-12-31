function CreateLobby({ name, setName, maxPlayers, setMaxPlayers, onCreateLobby, onBack, isConnected }) {
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
            <h1 style={{ fontSize: "48px", marginBottom: "60px" }}>Create Lobby</h1>

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
                    Max Number of Players
                </label>
                <input
                    type="number"
                    min="2"
                    max="10"
                    placeholder="2-10"
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(e.target.value)}
                    style={{
                        padding: "15px",
                        fontSize: "18px",
                        width: "100%",
                        borderRadius: "8px",
                        border: "2px solid #ddd",
                        boxSizing: "border-box"
                    }}
                />
                <p style={{
                    fontSize: "14px",
                    color: "#666",
                    marginTop: "8px",
                    textAlign: "center"
                }}>
                    (Between 2-10 players)
                </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <button
                    onClick={onCreateLobby}
                    disabled={!isConnected || !name.trim() || maxPlayers === "" || Number(maxPlayers) < 2 || Number(maxPlayers) > 10}
                    style={{
                        padding: "20px 40px",
                        fontSize: "24px",
                        backgroundColor: (!isConnected || !name.trim() || maxPlayers === "" || Number(maxPlayers) < 2 || Number(maxPlayers) > 10) ? "#ccc" : "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        cursor: (!isConnected || !name.trim() || maxPlayers === "" || Number(maxPlayers) < 2 || Number(maxPlayers) > 10) ? "not-allowed" : "pointer",
                        fontWeight: "bold",
                        transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                    Create Lobby
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

export default CreateLobby;