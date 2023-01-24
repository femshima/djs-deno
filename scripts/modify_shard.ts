const path = "node_modules/discord.js/src/client/websocket/WebSocketShard.js";

const orig = await Deno.readTextFile(path);

const modified = orig
  .replace(
    "const WebSocket = require('../../WebSocket');",
    "let WebSocket = require('../../WebSocket');",
  )
  .replace(
    "class WebSocketShard extends EventEmitter {\n  constructor",
    "class WebSocketShard extends EventEmitter {\n  static setWS(ws){WebSocket=ws;}\n  constructor",
  );

await Deno.writeTextFile(path, modified);
