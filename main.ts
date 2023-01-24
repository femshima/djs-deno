import * as Discord from "npm:discord.js";
import "https://deno.land/x/dotenv@v3.2.0/load.ts";

import { MyWebSocket } from "./ws.ts";

(Discord.WebSocketShard as any).setWS(MyWebSocket);

const { Client } = Discord;

const client = new Client({
  intents: ["Guilds"],
});

client.on("debug", console.error);

client.on("ready", () => {
  console.log(client.guilds.cache);
});

client.login(Deno.env.get("DISCORD_TOKEN"));
