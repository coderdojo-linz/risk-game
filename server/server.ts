import * as http from 'http';
import cors from 'cors';

import { Server, Socket } from 'socket.io';
import express from 'express';
import bodyParser from 'body-parser';

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
app.get('/', (req, res) => {
  res.send('risk game server');
});
//
// new player connects
io.on('connection', (socket: Socket) => {
  console.log('new connection');
  // player disconnect
  socket.on('disconnect', (reason: any) => {
    console.log('disconnected');
  });
});

// start server
const port = process.env.PORT || 3001;
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
