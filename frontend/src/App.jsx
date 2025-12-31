import { useState, useCallback } from "react";
import useWebSocket from "./hooks/useWebSocket";
import HomePage from "./pages/Home";
import CreateLobbyPage from "./pages/CreateLobby";
import JoinLobbyPage from "./pages/JoinLobby";
import LobbyPage from "./pages/Lobby";
import Game from "./pages/Game";
import EndGame from "./pages/EndGame";

function App() {
  const [currentPage, setCurrentPage] = useState("home"); 
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [playerRole, setPlayerRole] = useState(null);
  const [maxPlayers, setMaxPlayers] = useState("");
  const [gameData, setGameData] = useState(null);

  const handleLobbyCreated = useCallback((data) => {
    setRoomCode(data.room_code);
    setIsHost(true);
    setCurrentPage("lobby");
  }, []);

  const handleLobbyUpdate = useCallback((data) => {
    setPlayers(data.players);
    setCurrentPage((current) => current === "joinSetup" ? "lobby" : current);
  }, []);

  const handleGameStarted = useCallback((data) => {
    setGameData(data); // Store category, word, role
    setCurrentPage("game");
  }, []);

  const handleGameEnded = useCallback((data) => {
    setGameData(prevData => ({ ...prevData, ...data }));
    setCurrentPage("results");
  }, []);

  const handleRevealImposter = useCallback((data) => {
    setGameData(prevData => ({ ...prevData, ...data })); 
    setCurrentPage("results");
  }, []);

  const { isConnected, sendMessage } = useWebSocket({
    onLobbyCreated: handleLobbyCreated,
    onLobbyUpdate: handleLobbyUpdate,
    onGameStarted: handleGameStarted,
    onGameEnded: handleGameEnded,
    onRevealImposter: handleRevealImposter,
  });

  // Navigation actions
  const handleGoToHostSetup = () => {
    setCurrentPage("hostSetup");
  };

  const handleGoToJoinSetup = () => {
    setCurrentPage("joinSetup");
  };

  const handleBackToHome = () => {
    setCurrentPage("home");
    setName("");
    setRoomCode("");
    setRoomCodeInput("");
    setPlayers([]);
    setIsHost(false);
    setPlayerRole(null);
  };

  // Game actions
  const handleCreateLobby = () => {
    if (!name || !isConnected) return;

    sendMessage("create_lobby", { name, max_players: Number(maxPlayers) });
  };

  const handleJoinLobby = () => {
    if (!name || !roomCodeInput || !isConnected) return;

    setRoomCode(roomCodeInput);
    sendMessage("join_room", { name, room_code: roomCodeInput });
  };

  const handleStartGame = () => {
    sendMessage("start_game", { room_code: roomCode });
  };

  const handleToggleReady = () => {
    sendMessage("toggle_ready", { room_code: roomCode });
  };

  const handleRevealImposterButton = () => {
    sendMessage("reveal_imposter", { room_code: roomCode });
  };

  const handleLeaveLobby = () => {
    setCurrentPage("home");
    setRoomCode("");
    setRoomCodeInput("");
    setPlayers([]);
    setIsHost(false);
    sendMessage("leave_room", { room_code: roomCode });
  };

  const handleBackToLobby = () => {
    setCurrentPage("lobby");
    setGameData(null);
  };

  // Render current page
  return (
    <div>
      {currentPage === "home" && (
        <HomePage
          onHostGame={handleGoToHostSetup}
          onJoinGame={handleGoToJoinSetup}
          isConnected={isConnected}
        />
      )}

      {currentPage === "hostSetup" && (
        <CreateLobbyPage
          name={name}
          setName={setName}
          maxPlayers={maxPlayers}
          setMaxPlayers={setMaxPlayers}
          onCreateLobby={handleCreateLobby}
          onBack={handleBackToHome}
          isConnected={isConnected}
        />
      )}

      {currentPage === "joinSetup" && (
        <JoinLobbyPage
          name={name}
          setName={setName}
          roomCodeInput={roomCodeInput}
          setRoomCodeInput={setRoomCodeInput}
          onJoinLobby={handleJoinLobby}
          onBack={handleBackToHome}
          isConnected={isConnected}
        />
      )}

      {currentPage === "lobby" && (
        <LobbyPage
          roomCode={roomCode}
          players={players}
          onStartGame={handleStartGame}
          onLeaveLobby={handleLeaveLobby}
          onToggleReady={handleToggleReady}
          isHost={isHost}
          currentPlayerName={name}
        />
      )}

      {currentPage === "game" && (
        <Game
          gameData={gameData}
          roomCode={roomCode}
          players={players}
          onRevealImposter={handleRevealImposterButton}
        />
      )}

      {currentPage === "results" && gameData && (
        <EndGame
          imposter={gameData.imposter}
          word={gameData.word}
          onReturnToLobby={handleBackToLobby}
        />
      )}
    </div>
  );
}

export default App;