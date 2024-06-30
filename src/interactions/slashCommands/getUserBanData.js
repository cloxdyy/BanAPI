import { GUILD_ID, BLOXLINK_API_KEY, ASSETS } from "../../../src/config.js";
import { EmbedBuilder, ApplicationCommandOptionType } from "discord.js";
import { UserRestrictionsApi } from "openblox/cloud";
import { ClassicThumbnailsApi, ClassicUsersApi } from "openblox/classic";

async function getUserId(subCommand, data) {
    if (subCommand === "discord") {
        data = data.id
        const response = await fetch(`https://api.blox.link/v4/public/guilds/${GUILD_ID}/discord-to-roblox/${data}`, {
            headers: { "Authorization": BLOXLINK_API_KEY }
        });
        const result = await response.json();
        data = result.robloxID;
        return data;
    } else if (subCommand === "user") {
        const { data: usersInfo } = await ClassicUsersApi.usernamesToUsersInfo({ usernames: [data] });
        data = usersInfo[data].id

        return data;
    } else if (subCommand === "id") {
        return data;
    }
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


export const Slash = {
    name: "getban",
    description: "Returns ban data of the requested user",
    options: [
        {
            name: "discord",
            description: "Returns ban data of the requested discord user",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: "The discord account of the user you want to get the ban data of",
                    type: ApplicationCommandOptionType.User,
                    required: true
                },
                {
                    name: "raw",
                    description: "Returns the raw ban data of the user",
                    type: ApplicationCommandOptionType.Boolean,
                    required: false
                }
            ]
        },
        {
            name: "user",
            description: "Returns ban data of the requested user",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: "The roblox username of the user you want to get the ban data of",
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "raw",
                    description: "Returns the raw ban data of the user",
                    type: ApplicationCommandOptionType.Boolean,
                    required: false
                }
            ]
        },
        {
            name: "id",
            description: "Returns ban data of the requested id",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "id",
                    description: "The roblox id of the user you want to get the ban data of",
                    type: ApplicationCommandOptionType.Number,
                    required: true
                },
                {
                    name: "raw",
                    description: "Returns the raw ban data of the user",
                    type: ApplicationCommandOptionType.Boolean,
                    required: false
                }
            ]
        }
    ],

    run: async (interaction) => {
        const subCommand = interaction.options.getSubcommand();
        const raw = interaction.options.getBoolean("raw") ?? false;
        let userId;

        await interaction.deferReply({ ephemeral: true });

        if (subCommand === "discord") {
            userId = await getUserId(subCommand, interaction.options.getUser("user"))
            
            const restrictions = await getUserRestrictions(userId)
            const { userInfo, thumbnail } = await getUserInfo(userId)

            if (raw === true) {
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
            } else {
                
            }
        } else if (subCommand === "user") {
            userId = await getUserId(subCommand, interaction.options.getString("user"))

            const restrictions = await getUserRestrictions(userId)
            const { userInfo, thumbnail } = await getUserInfo(userId)

            if (raw === true) {
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
            } else {
                
            }
        } else if (subCommand === "id") {
            userId = await getUserId(subCommand, interaction.options.getNumber("id"))

            const restrictions = await getUserRestrictions(userId)
            const { userInfo, thumbnail } = await getUserInfo(userId)

            if (raw === true) {
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
            } else {
                
            }
        }
    }
}