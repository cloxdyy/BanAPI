// import { UserRestrictionsApi } from "openblox/cloud";

// export const Slash = {
//     name: "getbans",
//     description: "Return a list of banned users in the BanAPI game",
//     run: async (interaction) => {
//         try {
//             const { data: logs } = await UserRestrictionsApi.listRestrictionLogs({
//                 universeId: 6176862927
//             });

//             const logsContent = JSON.stringify(logs, null, 2);

//             await interaction.reply({
//                 content: `\`\`\`json\n${logsContent}\n\`\`\``,
//                 ephemeral: true
//             });
//         } catch (error) {
//             console.error('Error fetching restriction logs:', error);

//             await interaction.reply({
//                 content: 'Failed to fetch the ban list. Please try again later.',
//                 ephemeral: true
//             });
//         }
//     }
// };

import { EmbedBuilder } from "discord.js"
import { UserRestrictionsApi } from "openblox/cloud";
import { ClassicThumbnailsApi, ClassicUsersApi } from "openblox/classic"

export const Slash = {
    name: "getbans",
    description: "Return a list of banned users in the BanAPI game",
    run: async (interaction) => {
        try {
            const { data: logs } = await UserRestrictionsApi.listRestrictionLogs({
                universeId: 6176862927
            });

            logs.forEach(async log => {
                log.user = log.user.replace("users/", "")

                const { data: usersInfo } = await ClassicUsersApi.userIdsToUsersInfo({ userIds: [log.user] });

                const { data: avatarsHeadshotsThumbnails } = await ClassicThumbnailsApi.avatarsHeadshotsThumbnails({
                    userIds: [log.user],
                    isCircular: true,
                    format: "png",
                  });

                const embed = new EmbedBuilder()
                .setAuthor({
                    name: `@${usersInfo[log.user].name}[${log.user}]`,
                    url: `https://rblx.name/${log.user}`,
                    iconURL: avatarsHeadshotsThumbnails[log.user].imageUrl,
                  })
                  .addFields(
                    {
                      name: "duration",
                      value: `\`\`\`json\n${log.duration}\n\`\`\``,
                      inline: true
                    },
                    {
                      name: "reason",
                      value: `\`\`\`json\n${log.displayReason}\n\`\`\``,
                      inline: true
                    },
                    {
                      name: "** **",
                      value: "** **",
                      inline: false
                    },
                    {
                      name: "private reason",
                      value: `\`\`\`json\n${log.privateReason}\n\`\`\``,
                      inline: true
                    },
                    {
                      name: "moderator",
                      value: `\`\`\`json\n${log.moderator}\n\`\`\``,
                      inline: true
                    },
                  )
                  .setTimestamp(log.startTime);

                interaction.reply({ embeds: [embed], ephemeral: true });
            });
        } catch (error) {
            console.error('Error fetching restriction logs:', error);

            await interaction.reply({
                content: 'Failed to fetch the ban list. Please try again later.',
                ephemeral: true
            });
        }
    }
};