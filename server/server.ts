import * as http from 'http';
import cors from 'cors';

import { Server, Socket } from 'socket.io';
import express from 'express';
import bodyParser from 'body-parser';
import { Game } from './risk/game';
import { Player } from './risk/player';
import { GameController } from './risk/game-controller';
import { Territory } from './risk/territory';
import { Country } from './risk/country';

const app = express();
app.use(cors());
app.use(express.static('assets', { maxAge: '3600000' }));
app.use(bodyParser.json());

const server = http.createServer(app);

// initialize the WebSocket server instance
const corsOptions = {
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  origin: "*",
  credentials: false
};
const io = new Server(server, { cors: corsOptions });

const gameController = new GameController();

app.get('/', (req, res) => {
  res.send('risk game server');
});

// new player connects
io.on('connection', (socket: Socket) => {
  console.log('new connection');
  let game: Game | null = null;
  let player: Player | null = null;
  let currentGameController: GameController | null = null;

  // send games to client
  socket.emit('games changed', gameController.games);

  // create game
  socket.on('create game', (playerName: string, gameName: string) => {
    if (player) {
      socket.emit('error', 'You can join only one game.');
      return;
    }

    const result = gameController.startGame(playerName, gameName);
    player = result.player;
    game = result.game;

    console.log('game created', game.name, 'player', player.name);

    socket.join(game.id.toString());
    socket.emit('game created', game);
    socket.emit('games changed', gameController.games);
    socket.broadcast.emit('games changed', gameController.games);
  });

  // join game
  socket.on('join game', (playerName: string, gameId: number) => {
    if (player) {
      socket.emit('error', 'You can join only one game.');
      return;
    }

    try {
      const result = gameController.joinGame(playerName, gameId);
      player = result.player;
      game = result.game

      socket.join(game.id.toString());
      socket.emit('game joined', game);
      socket.to(game.id.toString()).broadcast.emit('game updated', game);
      socket.broadcast.emit('games changed', gameController.games);
    } catch (error: any) {
      socket.emit('error', error.message);
    }
  });

  // start gam
  socket.on('start game', () => {
    if(!player || !game) {
      socket.emit("error", "Es wurd noch kein Spiel angelegt.");
      return;
    }
    game.start();
    socket.to(game.id.toString()).broadcast.emit("game updated", game);
    socket.emit("game updated", game);
    socket.broadcast.emit("games changed", gameController.games);
    socket.emit("games changed", gameController.games);
  });

  // allocate territory
  socket.on('allocate territory', (country: Country) => {
    // TODO: allocate territory
  });

  // leave game
  socket.on('leave game', () => {
    if (!player || !game) {
      return;
    }

    try {
      socket.leave(game.id.toString());
      const result = gameController.leaveGame(player, game);
      player = null;
      game = null;

      if (result.status === 'stopped' && result.game !== null) {
        console.log('game stopped', result.game.id, result.game.name);
        socket.to(result.game.id.toString()).broadcast.emit('game stopped');
        socket.emit('games changed', gameController.games);
        socket.broadcast.emit('games changed', gameController.games);
      } else if (result.status === 'left' && result.game !== null) {
        console.log('player left', result.game.id, result.game.name);
        socket.to(result.game.id.toString()).broadcast.emit('game updated', result.game);
        socket.broadcast.emit('games changed', gameController.games);
      }
    } catch (error: any) {
      socket.emit('error', error.message);
    }
  });

  // player disconnects
  socket.on('disconnect', (reason: any) => {
    const result = gameController.leaveGame(player, game);
    if (result.status === 'stopped' && result.game !== null) {
      console.log('game stopped', result.game.id, result.game.name);
      socket.to(result.game.id.toString()).broadcast.emit('game stopped');
      socket.broadcast.emit('games changed', gameController.games);
    } else if (result.status === 'left' && result.game !== null) {
      console.log('player left', result.game.id);
      socket.to(result.game.id.toString()).broadcast.emit('game updated', result.game);
      socket.broadcast.emit('games changed', gameController.games);
    }

    console.log('player', player ? player.name : '', 'disonnected', reason);
  });
});

// start server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(ansi`{33}[SERVER]{0}: Server started on port {1}${port}{0}.`);
});
process.on("SIGINT", () => {
  console.log(ansi`{33}[SERVER]{0}: Server stopped.`);
});


function ansi(text: TemplateStringsArray, ...values: any[]) {
  const array = text.map(t => t.replace(/\{(\d+(?:;\d+)*)\}/g, (_, codes) => `\u001b[${codes}m`));
  values.forEach((val, index) => {
    array.splice(index * 2 + 1, 0, val);
  })
  return array.join("");
}