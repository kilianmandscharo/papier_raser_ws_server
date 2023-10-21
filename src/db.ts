import { RedisClientType, createClient } from "redis";
import { Socket } from "socket.io";

export interface Player {
  name: string;
  socket: Socket;
}

export class Database {
  client: RedisClientType;

  constructor() {
    this.client = createClient();
    this.client.on("error", (err) => console.log("Redis Client Error", err));
    this.client.connect().then(() => {
      this.flush();
    });
  }

  private async flush(): Promise<void> {
    await this.client.flushAll();
  }

  async getPlayers(lobbyID: string): Promise<Player[] | null> {
    const playersString = await this.client.get(lobbyID);
    return playersString ? (JSON.parse(playersString) as Player[]) : null;
  }

  async addPlayer(
    lobbyID: string,
    name: string,
    socket: Socket
  ): Promise<void> {
    const playersString = await this.client.get(lobbyID);

    if (playersString === null) {
      await this.client.set(lobbyID, JSON.stringify([{ name, socket }]));
    } else {
      const players: Player[] = JSON.parse(playersString);
      players.push({ name, socket });
      await this.client.set(lobbyID, JSON.stringify(players));
    }
  }
}
