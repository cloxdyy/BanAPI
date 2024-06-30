import { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } from "discord.js";
import { UserRestrictionsApi } from "openblox/cloud";
import { ClassicThumbnailsApi, ClassicUsersApi } from "openblox/classic";

export const Slash = {
    name: "getbans",
    description: "Return a list of banned users in the BanAPI game",
    run: async (interaction) => {
        try {
            const { data: logs } = await UserRestrictionsApi.listRestrictionLogs({
                universeId: 6176862927
            });

            const components = [];
            const embeds = [];

            for (const log of logs) {
                const userId = log.user.replace("users/", "");

                const { data: usersInfo } = await ClassicUsersApi.userIdsToUsersInfo({ userIds: [userId] });
                const { data: avatarsHeadshotsThumbnails } = await ClassicThumbnailsApi.avatarsHeadshotsThumbnails({
                    userIds: [userId],
                    isCircular: true,
                    format: "png",
                });

                const userInfo = usersInfo[userId];
                const thumbnail = avatarsHeadshotsThumbnails[userId].imageUrl;

                const embed = new EmbedBuilder()
                    .setColor("#992D22")
                    .setAuthor({
                        name: `@${userInfo.name} [${userId}]`,
                        url: `https://rblx.name/${userId}`,
                        iconURL: thumbnail,
                    })
                    .addFields(
                        {
                            name: "Active",
                            value: `\`\`\`json\n${JSON.stringify(log.active, null, 2)}\n\`\`\``,
                            inline: true
                        },
                        {
                            name: "Duration",
                            value: `\`\`\`json\n${JSON.stringify(log.duration, null, 2)}\n\`\`\``,
                            inline: true
                        },
                        {
                            name: "<:empty:1256764165717102732>",
                            value: "<:div:1256763041656082452><:div:1256763041656082452><:div:1256763041656082452><:div:1256763041656082452><:div:1256763041656082452><:div:1256763041656082452><:div:1256763041656082452><:div:1256763041656082452><:div:1256763041656082452><:div:1256763041656082452><:div:1256763041656082452><:div:1256763041656082452><:div:1256763041656082452><:div:1256763041656082452><:div:1256763041656082452><:div:1256763041656082452><:div:1256763041656082452><:div:1256763041656082452><:div:1256763041656082452><:div:1256763041656082452><:div:1256763041656082452><:div:1256763041656082452><:div:1256763041656082452><:div:1256763041656082452><:div:1256763041656082452><:div:1256763041656082452><:div:1256763041656082452>\n<:empty:1256764165717102732>",
                            inline: false
                          },
                        {
                            name: "displayReason",
                            value: `\`\`\`json\n${JSON.stringify(log.displayReason, null, 2)}\n\`\`\``,
                            inline: true
                        },
                        {
                            name: "privateReason",
                            value: `\`\`\`json\n${JSON.stringify(log.privateReason, null, 2)}\n\`\`\``,
                            inline: true
                        })
                        .setTimestamp(log.startTime)
                embeds.push(embed);
            }

            const button = new ButtonBuilder()
            .setCustomId("getRawData")
            .setLabel("Raw")
            .setEmoji("<:json:1256769891764146229>")
            .setStyle(ButtonStyle.Secondary);

            components.push(new ActionRowBuilder().addComponents(button));

            await interaction.reply({ embeds, components, ephemeral: true });
        } catch (error) {
            console.error('Error fetching restriction logs:', error);

            await interaction.reply({
                content: 'Failed to fetch the ban list. Please try again later.',
                ephemeral: true
            });
        }
    }
};