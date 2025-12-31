from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from data import CATEGORIES
import random


app = FastAPI()

# Allow frontend dev server to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Room management
rooms = {}  # key: room_code, value: {"players": []}

# Store active connections
active_connections = []


@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    active_connections.append(ws)

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
        print("Connection closed:", e)
    finally:
        # Clean up when connection closes
        if ws in active_connections:
            active_connections.remove(ws)
        if player_room:
            await handle_leave_room(player_room, ws)


def generate_room_code():
    while True:
        code = str(random.randint(1000, 9999))
        if code not in rooms:
            return code


async def handle_create_lobby(ws, payload):
    name = payload["name"]
    room_code = generate_room_code()

    rooms[room_code] = {"host": name, 
                        "players": [
                            {
                                "name": name, 
                                "ws": ws, 
                                "ready": False
                            }
                        ]}

    await ws.send_json({"type": "lobby_created", "payload": {"room_code": room_code}})

    await send_lobby_update(room_code)

    return {"room_code": room_code, "name": name}


async def handle_join_room(ws, payload):
    room_code = payload["room_code"]
    player_name = payload["name"]

    if room_code not in rooms:
        await ws.send_json({"type": "error", "payload": {"message": "Room not found"}})
        return None

    rooms[room_code]["players"].append(
        {"name": player_name, "ws": ws, "ready": False})

    await send_lobby_update(room_code)

    return {"room_code": room_code, "name": player_name}


async def handle_leave_room(room_code, ws):
    """Remove player from room and notify others"""
    if room_code not in rooms:
        return

    room = rooms[room_code]
    room["players"] = [p for p in room["players"] if p["ws"] != ws]

    if len(room["players"]) == 0:
        del rooms[room_code]
    else:
        await send_lobby_update(room_code)


async def send_lobby_update(room_code):
    if room_code not in rooms:
        return

    room = rooms[room_code]
    players_info = [{"name": p["name"], "ready": p["ready"]}
                    for p in room["players"]]

    for player in room["players"]:
        try:
            await player["ws"].send_json({
                "type": "lobby_update",
                "payload": {"players": players_info}
            })
        except Exception as e:
            print(f"Error sending to player: {e}")


async def handle_toggle_ready(room_code, ws):
    """Toggle ready status for a player"""
    if room_code not in rooms:
        return

    room = rooms[room_code]

    for player in room["players"]:
        if player["ws"] == ws:
            player["ready"] = not player["ready"]
            break

    await send_lobby_update(room_code)


import random

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
                "is_host": is_host
            }
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

    for player in room["players"]:
        try:
            await player["ws"].send_json({
                "type": "game_ended",
                "payload": {"imposter": imposter_name, "word": actual_word}
            })
        except Exception as e:
            print(f"Error sending reveal to player: {e}")
        
    await send_lobby_update(room_code)
