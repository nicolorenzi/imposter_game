function Game({ gameData, roomCode, players, onBackToLobby, onRevealImposter }) {

    if (!gameData) return <div>Loading...</div>;

    return (
        <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
            <h1>Game Started!</h1>

            <div style={{
                padding: "40px",
                backgroundColor: gameData.is_imposter ? "#ffe6e6" : "#e6f7ff",
                borderRadius: "10px",
                marginTop: "30px",
                marginBottom: "30px"
            }}>
                <h2 style={{ marginBottom: "20px", color: "#000" }}>
                    Category: {gameData.category.charAt(0).toUpperCase() + gameData.category.slice(1)}
                </h2>

                <div style={{
                    fontSize: "48px",
                    fontWeight: "bold",
                    color: gameData.is_imposter ? "#dc3545" : "#007bff",
                    marginTop: "20px"
                }}>
                    {gameData.word}
                </div>

                <p style={{ marginTop: "15px", fontSize: "18px", color: "#000" }}>
                    <strong>{gameData.starter}</strong> goes first
                    <p style={{ marginTop: "10px", fontSize: "16px", color: "#000" }}>
                        Go {Math.random() < 0.5 ? "clockwise" : "counter-clockwise"} around the room.
                    </p>
                </p>
            </div>

            <div>
                {gameData.is_host && (
                    <button
                        onClick={onRevealImposter}
                        style={{
                            marginTop: "20px",
                            padding: "12px 20px",
                            fontSize: "16px",
                            borderRadius: "6px",
                            border: "none",
                            backgroundColor: "#dc3545",
                            color: "#fff",
                            cursor: "pointer",
                        }}
                    >
                        Reveal Imposter
                    </button>
                )}
            </div>

            <div style={{ marginTop: "30px" }}>
                <h3>Players ({players.length})</h3>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {players.map((p, index) => (
                        <li key={index} style={{ padding: "10px", backgroundColor: "#f8f9fa", marginBottom: "5px", borderRadius: "5px", color: "#000" }}>
                            {p.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Game;