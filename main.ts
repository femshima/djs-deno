import { Client, WebSocketShard } from "npm:discord.js";
import "https://deno.land/x/dotenv@v3.2.0/load.ts";

import { MyWebSocket } from "./ws.ts";

(WebSocketShard as any).setWS(MyWebSocket);

const client = new Client({
  intents: ["Guilds"],
});

client.on("debug", console.error);

client.on("ready", () => {
  console.log(client.guilds.cache);
});

client.login(Deno.env.get("DISCORD_TOKEN"));
