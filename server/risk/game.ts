import { Player } from "./player";

export class Game {
    static maxId: number = 0;

    players: Player[] = [];
    id: number;

    constructor(public name: string, player: Player) {
        this.id = Game.maxId;
        Game.maxId++;
        this.players.push(player);
    }
     
}