import { channelCooldownFN } from "./channelCooldown.js";
import { globalCooldownFN } from "./globalCooldown.js";
import { guildCooldownFN } from "./guildCooldown.js";

export default async (client, message, command, interactionType) => {
    const channelCooldown = await channelCooldownFN(client, message, command, interactionType);
    const globalCooldown = await globalCooldownFN(client, message, command, interactionType);
    const guildCooldown = await guildCooldownFN(client, message, command, interactionType);
    const finalCorrection = [channelCooldown, guildCooldown, globalCooldown];
    if (finalCorrection.includes(false)) return false;
    else return true;
};