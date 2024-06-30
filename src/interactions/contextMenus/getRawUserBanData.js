import { GUILD_ID, BLOXLINK_API_KEY, ASSETS } from "../../config.js";
import { EmbedBuilder, ApplicationCommandType } from "discord.js";
import { UserRestrictionsApi } from "openblox/cloud";
import { ClassicThumbnailsApi, ClassicUsersApi } from "openblox/classic";

async function getUserId(discordId) {
        const response = await fetch(`https://api.blox.link/v4/public/guilds/${GUILD_ID}/discord-to-roblox/${discordId}`, {
            headers: { "Authorization": BLOXLINK_API_KEY }
        });
        const result = await response.json();
        discordId = result.robloxID;
        return discordId;
}

async function getUserInfo(userId) {
    const { data: userInfo } = await ClassicUsersApi.userInfo({ userId: userId });
    const { data: avatarsHeadshotsThumbnails } = await ClassicThumbnailsApi.avatarsHeadshotsThumbnails({
        userIds: [userId],
        format: "png",
        isCircular: true,
      }); 

    const thumbnail = avatarsHeadshotsThumbnails[userId].imageUrl;
    return { userInfo, thumbnail };
}

async function getUserRestrictions(userId) {
    const { data: restrictions } = await UserRestrictionsApi.restrictions({
        universeId: 6176862927,
        userId: userId
      }); 

    return restrictions;
}

export const Context = {
    name: "getRawUserBanData",
    type: ApplicationCommandType.User,
    run: async (interaction) => {
        let member = interaction.guild.members.cache.get(interaction.targetId);
        if (!member) member = interaction.member;
        let userId;

        await interaction.deferReply({ ephemeral: true });

        userId = await getUserId(member.user.id)
            
        const restrictions = await getUserRestrictions(userId)
        const { userInfo, thumbnail } = await getUserInfo(userId)

        const embed = new EmbedBuilder()
        .setAuthor({
           name: `@${userInfo.name} [${userId}]`,
           url: `https://rblx.name/${userId}`,
           iconURL: thumbnail,
        })
        .setColor("#992D22")
        .setDescription(`\`\`\`json\n${JSON.stringify(restrictions.gameJoinRestriction, null, 2)}\n\`\`\``)
        .setFooter({
            text: "BanAPI",
            iconURL: ASSETS.json
        })

        if (restrictions.startTime != null) {
            embed.setTimestamp(restrictions.startTime)
        }

    await interaction.editReply({ embeds: [embed], ephemeral: true });
    }
};
