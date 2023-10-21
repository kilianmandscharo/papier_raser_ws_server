import { createClient } from "redis";
export class Database {
    client;
    constructor() {
        this.client = createClient();
        this.client.on("error", (err) => console.log("Redis Client Error", err));
        this.client.connect().then(() => {
            this.flush();
        });
    }
    async flush() {
        await this.client.flushAll();
    }
    async getPlayers(lobbyID) {
        const playersString = await this.client.get(lobbyID);
        return playersString ? JSON.parse(playersString) : null;
    }
    async addPlayer(lobbyID, name, socket) {
        const playersString = await this.client.get(lobbyID);
        if (playersString === null) {
            await this.client.set(lobbyID, JSON.stringify([{ name, socket }]));
        }
        else {
            const players = JSON.parse(playersString);
            players.push({ name, socket });
            await this.client.set(lobbyID, JSON.stringify(players));
        }
    }
}
