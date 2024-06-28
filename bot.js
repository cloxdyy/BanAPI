import { Client, GatewayIntentBits, Partials } from "discord.js";
import { setConfig } from "openblox/config";
import { BOT_TOKEN, ROBLOX_COOKIE, ROBLOX_CLOUD_KEY } from "./src/config.js";
import { dirname } from "node:path";
import { ButtonManager } from "./src/structures/managers/buttonCommands.js";
import { EventManager } from "./src/structures/managers/events.js";
import { ModalManager } from "./src/structures/managers/modalForms.js";
import { SelectMenuManager } from "./src/structures/managers/selectMenus.js";
import { SlashManager } from "./src/structures/managers/slashCommands.js";
import JSONdb from "simple-json-db";

const __dirname = dirname(import.meta.url);
export const rootPath = __dirname;

(async () => {
    setConfig({
        cookie: ROBLOX_COOKIE,
        cloudKey: ROBLOX_CLOUD_KEY
      })

    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildWebhooks,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildInvites,
        ],
        partials: [Partials.Channel]
    });

    client.cooldownDB = new JSONdb("./cooldownDB.json");

    client.events = new Map();
    client.buttonCommands = new Map();
    client.selectMenus = new Map();
    client.modalForms = new Map();
    client.contextMenus = new Map();
    client.slashCommands = new Map();

    await EventManager(client, __dirname);
    await ButtonManager(client, __dirname);
    await SelectMenuManager(client, __dirname);
    await ModalManager(client, __dirname);
    await client.login(BOT_TOKEN);
    await SlashManager(client, __dirname);
})();