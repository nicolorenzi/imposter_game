function EndGame({ imposter, word, onReturnToLobby }) {
  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "600px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h1>Game Over</h1>

      <div
        style={{
          marginTop: "30px",
          padding: "30px",
          borderRadius: "10px",
          backgroundColor: "#ffe6e6",
        }}
      >
        <h2 style={{
            color: "#000",
          }}>The Imposter Was</h2>
        <p
          style={{
            fontSize: "36px",
            fontWeight: "bold",
            color: "#dc3545",
            marginTop: "15px",
          }}
        >
          {imposter}
        </p>
        <p
          style={{
            fontSize: "20px",
            color: "#000",
            marginTop: "20px",
          }}
        >
          The word was: <strong>{word}</strong>
        </p>
      </div>

      <button
        onClick={onReturnToLobby}
        style={{
          marginTop: "40px",
          padding: "12px 24px",
          fontSize: "16px",
          borderRadius: "6px",
          border: "none",
          backgroundColor: "#007bff",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Return to Lobby
      </button>
    </div>
  );
}

export default EndGame;