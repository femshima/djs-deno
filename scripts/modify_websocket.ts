const path = "node_modules/discord.js/src/WebSocket.js";

const orig = await Deno.readTextFile(path);

const modified = orig
  .replace(
    "exports.WebSocket = require('ws');",
    "exports.WebSocket = WebSocket;",
  )
  .replace(
    "const ws = new exports.WebSocket(`${g}?${query}`, ...args);",
    "const ws = new exports.WebSocket(`${g}?${query}`);",
  );

await Deno.writeTextFile(path, modified);
