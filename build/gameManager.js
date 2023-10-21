export default class GameManager {
    games = {};
    addPlayer(gameID, name, socket) {
        const player = { name, socket, ready: false };
        if (this.games[gameID] === undefined) {
            this.games[gameID] = [player];
        }
        else {
            this.games[gameID].push(player);
        }
    }
    getPlayers(gameID) {
        return this.games[gameID];
    }
    playerReady(gameID, name) {
        const player = this.games[gameID].find((p) => p.name === name);
        if (player) {
            player.ready = true;
        }
    }
}
