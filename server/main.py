"""
Imposter Game Backend Server

This module implements the FastAPI backend for the Imposter multiplayer word game.
It handles WebSocket connections for real-time gameplay, room management, and game logic.

Features:
- WebSocket endpoint for real-time communication
- Room-based multiplayer lobbies
- Random word and imposter assignment
- CORS support for frontend integration
"""

import logging
import random
from typing import Dict

from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

_CATEGORY_SOURCE = {
    "animals": [
        "dog", "cat", "elephant", "giraffe", "lion", "tiger", "bear",
        "monkey", "zebra", "penguin", "dolphin", "shark", "eagle", "parrot",
        "kangaroo", "koala", "panda", "gorilla", "cheetah", "wolf", "fox",
        "rabbit", "horse", "cow", "pig", "chicken", "duck", "snake", "lizard"
    ],
    "food": [
        "pizza", "burger", "sushi", "pasta", "taco", "sandwich", "salad",
        "ice cream", "cake", "cookie", "donut", "pancake", "waffle", "steak",
        "chicken wings", "french fries", "burrito", "ramen", "curry",
        "dumplings", "spring rolls", "lasagna", "spaghetti",
        "croissant", "bagel", "muffin", "pie"
    ],
    "locations": [
        "beach", "mountain", "desert", "forest", "city", "airport", "hospital",
        "school", "restaurant", "gym", "library", "park", "zoo", "museum",
        "cinema", "mall", "hotel", "cafe", "subway", "train station", "harbor",
        "lighthouse", "castle", "pyramid", "church", "stadium", "bridge",
        "skyscraper", "farm"
    ],
    "occupations": [
        "doctor", "teacher", "chef", "pilot", "firefighter", "police officer",
        "engineer", "artist", "musician", "athlete", "scientist", "lawyer",
        "nurse", "accountant", "architect", "dentist", "veterinarian", "pharmacist",
        "writer", "journalist", "photographer", "actor", "dancer", "surgeon", "therapist"
    ],
    "sports": [
        "soccer", "basketball", "baseball", "tennis", "swimming", "golf",
        "hockey", "volleyball", "boxing", "skiing", "surfing", "skateboarding",
        "rugby", "cricket", "badminton", "table tennis", "martial arts", "cycling",
        "running", "gymnastics", "wrestling", "fencing", "archery", "bowling",
        "rock climbing", "ice skating", "snowboarding", "lacrosse", "rowing"
    ],
    "films": [
        "Titanic", "Avatar", "The Godfather", "Star Wars", "Jurassic Park",
        "The Lion King", "Frozen", "Spider-Man", "Iron Man", "Batman",
        "The Avengers", "Harry Potter", "Lord of the Rings", "Finding Nemo",
        "Toy Story", "Shrek", "The Matrix", "Forrest Gump", "Inception",
        "Pulp Fiction", "The Dark Knight", "Gladiator", "The Shawshank Redemption",
        "Back to the Future", "E.T.", "Jaws", "Rocky", "Top Gun", "Indiana Jones"
    ],
    "video Games": [
        "Minecraft", "Fortnite", "Roblox", "Grand Theft Auto", "Call of Duty",
        "FIFA", "Pokemon", "Mario Kart", "Super Mario", "Among Us", "League of Legends", 
        "Overwatch", "Valorant", "Apex Legends", "Rocket League", "Fall Guys", "Sims", 
        "Tetris", "Pac-Man", "Mortal Kombat", "Sonic", "Donkey Kong"
    ],
    "Soccer Players": [
        "Lionel Messi", "Cristiano Ronaldo", "Neymar", "Kylian Mbappe", "Erling Haaland",
        "Kevin De Bruyne", "Mohamed Salah", "Robert Lewandowski", "Luka Modric",
        "Karim Benzema", "Vinicius Junior", "Jude Bellingham", "Harry Kane",
        "Ronaldinho", "Zinedine Zidane", "Pele", "Diego Maradona", "David Beckham",
        "Sergio Ramos", "Virgil van Dijk", "Thibaut Courtois", "Manuel Neuer",
        "Paul Pogba", "Eden Hazard", "Luis Suarez", "Gareth Bale", "Andres Iniesta", "Sergio Ramos",
        "Pepe", "Marco Sau"
    ],
    "Historical Events": [
        "World War II", "Moon Landing", "American Revolution",
        "Industrial Revolution", "Great Depression", "9/11 Attacks",
        "Signing of Declaration of Independence", "Discovery of America", "Renaissance",
        "Cold War", "Vietnam War", "Civil Rights Movement",
        "Pearl Harbor", "D-Day", "Titanic Sinking", "First Flight", "Internet Invention",
        "Fall of Roman Empire", "Black Death", "Boston Tea Party", "Chernobyl Disaster"
    ],
    "school": [
        "classroom", "homework", "exam", "backpack", "textbook", "pencil",
        "notebook", "ruler", "whiteboard", "chalkboard",
        "desk", "chair", "locker", "cafeteria", "gymnasium", "playground",
        "recess", "detention", "report card", "graduation", "field trip",
        "science lab", "art class", "music class", "PE class", "library", "principal"
    ],
    "countries": [
        "United States", "China", "India", "Brazil", "Russia", "Japan",
        "Germany", "United Kingdom", "France", "Italy", "Spain", "Canada",
        "Mexico", "Australia", "South Korea", "Argentina", "Egypt", "Turkey",
        "South Africa", "Saudi Arabia", "Netherlands", "Switzerland", "Sweden",
        "Norway", "Greece", "Portugal", "Thailand", "Vietnam", "Nigeria"
    ],
    "brands": [
        "Apple", "Samsung", "Nike", "Adidas", "Coca-Cola", "Pepsi", "McDonald's",
        "Starbucks", "Google", "Amazon", "Microsoft", "Facebook", "Instagram",
        "Twitter", "YouTube", "Netflix", "Spotify", "Disney", "Toyota", "BMW",
        "Mercedes", "Tesla", "IKEA", "Walmart", "Target", "Gucci", "Louis Vuitton",
        "Rolex", "Sony", "Nintendo"
    ],
    "christmas": [
        "Santa Claus", "reindeer", "Christmas tree", "presents", "candy cane",
        "snowman", "gingerbread house", "mistletoe", "Christmas lights", "ornament",
        "stocking", "wreath", "sleigh", "North Pole", "elf", "jingle bells",
        "snow", "hot chocolate", "fireplace", "Christmas carol", "Rudolph",
        "gift wrapping", "Christmas Eve", "nativity scene", "star", "angel",
        "eggnog", "fruitcake", "Christmas cookies", "advent calendar"
    ]
}

def _title_case(text: str) -> str:
    return text.title()

DEFAULT_CATEGORIES = {
    _title_case(name): [_title_case(entry) for entry in entries]
    for name, entries in _CATEGORY_SOURCE.items()
}

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    from data import CATEGORIES
except ImportError:
    CATEGORIES = DEFAULT_CATEGORIES
    logger.info("Using built-in category dataset; create server/data.py to override locally.")

app = FastAPI(title="Imposter Game API", description="Backend for the Imposter word game")

# Allow frontend dev server to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["imposter-game-xamy.vercel.app"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

rooms: Dict[str, Dict] = {}


@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    """
    Main WebSocket endpoint for game communication.

    Handles player connections, message routing, and cleanup.
    Each player maintains their own connection and tracks their room/player state.
    """
    await ws.accept()

    player_room = None  # Track which room this player is in
    player_name = None  # Track this player's name

    await ws.send_json({"type": "connected", "payload": "Welcome!"})

    try:
        while True:
            message = await ws.receive_json()
            msg_type = message.get("type")

            if msg_type == "join_room":
                result = await handle_join_room(ws, message["payload"])
                if result:  # If join was successful
                    player_room = result["room_code"]
                    player_name = result["name"]
            elif msg_type == "create_lobby":
                result = await handle_create_lobby(ws, message["payload"])
                player_room = result["room_code"]
                player_name = result["name"]
            elif msg_type == "leave_room":
                if player_room:
                    await handle_leave_room(player_room, ws)
                    player_room = None
                    player_name = None
            elif msg_type == "toggle_ready":
                if player_room:
                    await handle_toggle_ready(player_room, ws)
            elif msg_type == "start_game":
                if player_room:
                    await handle_start_game(player_room)
            elif msg_type == "reveal_imposter":
                if player_room:
                    await handle_reveal_imposter(player_room)


    except Exception as e:
        logger.info("WebSocket connection closed: %s", e)
    finally:
        # Clean up when connection closes
        if player_room:
            await handle_leave_room(player_room, ws)


@app.get("/")
async def root() -> dict[str, str]:
    """Simple landing endpoint to explain the server exposes `/ws` only."""
    return {"message": "Imposter Game server exposes /ws for WebSocket clients."}


def generate_room_code():
    """Generate a unique 4-digit room code."""
    while True:
        code = str(random.randint(1000, 9999))
        if code not in rooms:
            return code


async def handle_create_lobby(ws, payload):
    """
    Create a new game lobby.

    Args:
        ws: WebSocket connection of the creator
        payload: Dict containing "name" of the player

    Returns:
        Dict with room_code and player name
    """
    name = payload["name"]
    room_code = generate_room_code()

    rooms[room_code] = {
        "host": name,
        "players": [
            {
                "name": name,
                "ws": ws,
                "ready": False,
            }
        ],
        "max_players": payload.get("max_players"),
    }

    await ws.send_json({"type": "lobby_created", "payload": {"room_code": room_code}})

    await send_lobby_update(room_code)

    return {"room_code": room_code, "name": name}


async def handle_join_room(ws, payload):
    """
    Handle a player joining an existing room.

    Args:
        ws: WebSocket connection of the joining player
        payload: Dict containing "room_code" and "name"

    Returns:
        Dict with room_code and player name if successful, None if room not found
    """
    room_code = payload["room_code"]
    player_name = payload["name"]

    room = rooms.get(room_code)
    if not room:
        await ws.send_json({"type": "error", "payload": {"message": "Room not found"}})
        return None

    room["players"].append({"name": player_name, "ws": ws, "ready": False})

    await send_lobby_update(room_code)

    return {"room_code": room_code, "name": player_name}


async def handle_leave_room(room_code, ws):
    """Remove player from room and notify others. Delete room if empty."""
    if room_code not in rooms:
        return

    room = rooms[room_code]
    room["players"] = [p for p in room["players"] if p["ws"] != ws]

    if len(room["players"]) == 0:
        del rooms[room_code]
    else:
        await send_lobby_update(room_code)


async def send_lobby_update(room_code):
    """
    Send updated lobby information to all players in the room.

    Args:
        room_code: The room code to update
    """
    room = rooms.get(room_code)
    if not room:
        return

    players_info = [{"name": p["name"], "ready": p["ready"]} for p in room["players"]]
    await broadcast_to_room(room_code, "lobby_update", {"players": players_info})


async def handle_toggle_ready(room_code, ws):
    """Toggle ready status for a player and update lobby."""
    room = rooms.get(room_code)
    if not room:
        return

    target = next((p for p in room["players"] if p["ws"] == ws), None)
    if not target:
        return

    target["ready"] = not target["ready"]
    await send_lobby_update(room_code)


async def broadcast_to_room(room_code: str, message_type: str, payload: Dict) -> None:
    """Send a JSON payload to every player currently in a room."""
    room = rooms.get(room_code)
    if not room:
        return

    for player in room["players"]:
        try:
            await player["ws"].send_json({"type": message_type, "payload": payload})
        except Exception as e:
            logger.warning("Failed to deliver %s to %s: %s", message_type, player["name"], e)


async def handle_start_game(room_code):
    """Start the game and assign roles"""
    if room_code not in rooms:
        return

    room = rooms[room_code]
    players = room["players"]
    host = room["host"]

    # Choose random category and word
    category = random.choice(list(CATEGORIES.keys()))
    word = random.choice(CATEGORIES[category])

    # Choose random imposter
    imposter_index = random.randint(0, len(players) - 1)

    # Choose random starting player
    starter_index = random.randint(0, len(players) - 1)
    starter_name = players[starter_index]["name"]

    # Store game state
    room["game_state"] = {
        "category": category,
        "word": word,
        "imposter": players[imposter_index]["name"],
        "starter": starter_name, 
        "host": host
    }

    # Send each player their role + starter
    for i, player in enumerate(players):
        is_imposter = (i == imposter_index)
        is_host = (player["name"] == host)

        await player["ws"].send_json({
            "type": "game_started",
            "payload": {
                "category": category,
                "word": word if not is_imposter else "IMPOSTER",
                "role": "imposter" if is_imposter else "civilian",
                "is_imposter": is_imposter,
                "starter": starter_name,
                "host": host,
                "is_host": is_host,
            },
        })

async def handle_reveal_imposter(room_code):
    """Notify all players who the imposter is."""
    if room_code not in rooms:
        return

    room = rooms[room_code]
    imposter_name = room["game_state"]["imposter"]
    actual_word = room["game_state"]["word"]

    for player in room["players"]:
        player["ready"] = False

    await broadcast_to_room(
        room_code,
        "game_ended",
        {"imposter": imposter_name, "word": actual_word},
    )

    await send_lobby_update(room_code)
