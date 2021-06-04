import { Game } from "./game";
import { Player } from "./player";

export class GameController {
    static colors = ['#03a9f4', '#4caf50', '#b71c1c', '#9c27b0', '#1a237e', '#607d8b'];
    games: Game[] = [];

    startGame(playerName: string, gameName: string): { player: Player, game: Game } {
        const player = new Player(playerName, GameController.colors[0]);
        const game = new Game(gameName, player);
        this.games.push(game);

        console.log('player', playerName, 'started game', gameName);
        return { player, game };
    }

    joinGame(playerName: string, gameId: number): { player: Player, game: Game } {
        if (!playerName) {
            throw (new Error('Player name is required.'))
        }

        const game = this.games.find(g => g.id === gameId);
        if (!game) {
            throw (new Error('Game not found.'));
        }

        if (game.players.length >= 6) {
            throw (new Error('No more players allowed.'));
        }

        if (game.state !== 'waitingForPlayers') {
            throw (new Error('You cannot join a game that is already running.'))
        }

        if (game.players.find(p => p.name === playerName)) {
            throw (new Error(`Name ${playerName} is already taken, please chose another name.`))
        }

        // find next available color
        let newColor = ''
        for (let i = 0; i < GameController.colors.length && !newColor; i++) {
            if (!game.players.find(p => p.color === GameController.colors[i])) {
                newColor = GameController.colors[i];
            }
        }

        const player = new Player(playerName, newColor);
        game.players.push(player);

        console.log('player', player.name, 'joined game', game.name);
        return { player, game };
    }

    leaveGame(player: Player | null, game: Game | null): { game: Game | null, status: 'stopped' | 'left' | null } {
        let status: 'stopped' | 'left' | null = null;
        let leftGame: Game | null = null;

        if (player && game) {
            const index = game.players.indexOf(player);

            if (index === 0 && game.state === 'waitingForPlayers') {
                leftGame = game;
                status = 'stopped';

                const gameIndex = this.games.indexOf(game);
                if (gameIndex >= 0) {
                    this.games.splice(gameIndex, 1);
                }

                console.log('player', player.name, 'stopped game', game.name);
            } else {
                game.players.splice(index, 1);
                leftGame = game;
                status = 'left';

                console.log('player', player.name, 'left game', game.name, game.players.length, 'players left');

                if (game.players.length === 0) {
                    // remove game if no players are left
                    status = 'stopped';

                    const gameIndex = this.games.indexOf(game);
                    if (gameIndex >= 0) {
                        this.games.splice(gameIndex, 1);
                    }

                    console.log('game', game.name, 'has been removed');
                } else {
                    // distribute territories
                    let i = 0;
                    for (let territory of player.territories) {
                        game.players[i % game.players.length].territories.push(territory);
                        i++;
                    }

                    if (game.currentPlayer >= game.players.length) {
                        game.currentPlayer++;
                    }
                }
            }
        }

        return { game: leftGame, status: status };
    }
}