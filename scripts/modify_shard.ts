const path = 'node_modules/discord.js/src/client/websocket/WebSocketShard.js';

const orig = await Deno.readTextFile(path);

const modified = orig
  .replace(
    "const WebSocket = require('../../WebSocket');",
    "let WebSocket = require('../../WebSocket');"
  )
  .replace(
    'class WebSocketShard extends EventEmitter {',
    'class WebSocketShard extends EventEmitter {\nstatic setWS(ws){WebSocket=ws;}'
  )

await Deno.writeTextFile(path, modified);