import { Game } from "./game";
import { Player } from "./player";

export class GameController {
    static colors = ['#03a9f4', '#4caf50', '#ff5722', '#9c27b0', '#ffeb3b', '#607d8b'];
    games: Game[] = [];

    startGame(playerName: string, gameName: string): {
        player: Player,
        game: Game
    } {
        let color: string = GameController.colors[0];
        let player: Player = new Player(playerName, color);
        let game: Game = new Game(gameName, player);
        this.games.push(game);
        return {
            player,
            game
        }
    }
}