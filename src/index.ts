import { createServer } from "node:http";
import { Server } from "socket.io";
import GameManager from "./gameManager.js";

const PORT = 8000;

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const gameManager = new GameManager();

io.on("connect", (socket) => {
  console.log("a user connected");

  socket.on("newPlayer", (data) => {
    const { name, id } = data;

    gameManager.addPlayer(id, name, socket);
    const players = gameManager.getPlayers(id);

    if (players !== undefined) {
      // Send the new player to each player in the lobby
      for (const player of players) {
        player.socket.emit("newPlayerResponse", {
          name: name,
          ready: false,
        });
      }

      // Send all players to the new player
      socket.emit(
        "newPlayerInit",
        players.map((p) => ({
          name: p.name,
          ready: p.ready,
        }))
      );
    }
  });

  socket.on("ready", (data) => {
    const { name, id } = data;
    gameManager.playerReady(id, name);

    const players = gameManager.getPlayers(id);

    if (players !== undefined) {
      for (const player of players) {
        player.socket.emit("readyResponse", name);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
