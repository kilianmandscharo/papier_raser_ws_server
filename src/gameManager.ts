import { Socket } from "socket.io";

interface Player {
  name: string;
  socket: Socket;
  ready: boolean;
}

type Game = Player[];

export default class GameManager {
  private games: Record<string, Game> = {};

  addPlayer(gameID: string, name: string, socket: Socket) {
    const player: Player = { name, socket, ready: false };

    if (this.games[gameID] === undefined) {
      this.games[gameID] = [player];
    } else {
      this.games[gameID].push(player);
    }
  }

  getPlayers(gameID: string): Game | undefined {
    return this.games[gameID];
  }

  playerReady(gameID: string, name: string) {
    const player = this.games[gameID].find((p) => p.name === name);
    if (player) {
      player.ready = true;
    }
  }
}
