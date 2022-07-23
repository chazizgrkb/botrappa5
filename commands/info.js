const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js')
const os = require('node:os')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Get information about the server, a user, or the bot.")
        .addSubcommand(subcommand => 
            subcommand
                .setName('user')
                .setDescription('Get information about a specified user.')
                .addUserOption(option => option.setName('target').setDescription('Select a user'))
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('server')
                .setDescription('Get information about the current server.')
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('role')
                .setDescription('Get information about a specified role.')
                .addRoleOption(option => option.setName('role').setDescription('Select a role').setRequired(true))
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('bot')
                .setDescription('Get information about the bot.')
        ),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'user') {
            let target = interaction.options.getUser('target') || interaction.user
            let tMember = interaction.guild.members.cache.get(target.id)
            const joined = new Date(tMember.joinedTimestamp).toLocaleString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })
            const created = new Date(target.createdTimestamp).toLocaleString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })    

            const userInfoEmbed = new EmbedBuilder()
            .setAuthor({ name: `User Info | ${target.tag}`, iconURL: target.avatarURL()})
            .addFields(
                { name: "Joined", value: `${joined.toString()}`, inline: true },
                { name: "Registered", value: `${created.toString()}`, inline: true },
                { name: "ID", value: `${target.id}`, inline: false },
                { name: "Discriminator", value: `#${target.discriminator}`, inline: false },
                { name: `Roles (${(tMember.roles.cache.size) - 1} roles)`, value: `${((tMember.roles.cache.size -1) >= 1) ? mapRoles(tMember) : 'None'}`, inline: false }
            )
            .setColor(0x5865F2)
            .setTimestamp()
            .setThumbnail(target.avatarURL({ dynamic: true }))
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.avatarURL()})

            interaction.reply({ embeds: [userInfoEmbed] })
        } else if (interaction.options.getSubcommand() === "server") {
            let server = interaction.guild
            let categories = server.channels.cache.filter(c => c.type === ChannelType.GuildCategory)
            let channels = server.channels.cache.filter(c => c.type === ChannelType.GuildText)
            let vcs = server.channels.cache.filter(c => c.type === ChannelType.GuildVoice)
            let createdDate = new Date(server.createdTimestamp).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric'})
            let owner = await server.fetchOwner();

            const serverInfoEmbed = new EmbedBuilder()
            .setAuthor({ name: `Server Info | ${server.name}`, iconURL: server.iconURL() })
            .addFields(
                { name: 'Owner', value: `${owner.user.tag}`, inline: true },
                { name: 'Region', value: `${server.preferredLocale}`, inline: true },
                { name: 'Categories', value: `${categories.size}`, inline: true },
                { name: 'Text Channels', value: `${channels.size}`, inline: true },
                { name: 'Voice Channels', value: `${vcs.size}`, inline: true },
                { name: 'Members', value: `${server.memberCount}`, inline: true },
                { name: 'Roles', value: `${server.roles.cache.size}`, inline: true },
                { name: 'ID', value: `${server.id}`, inline: true },
                { name: 'Created', value: `${createdDate}`, inline: true },
                { name: 'Role List', value: `${server.roles.cache.map(r => r.name).join(', ')}`, inline: false }
            )
            .setThumbnail(server.iconURL({ dynamic: true }))
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.avatarURL()})
            .setColor(0x5865F2)
            .setTimestamp()
    
            interaction.reply({ embeds: [serverInfoEmbed] })    
        } else if (interaction.options.getSubcommand() === "role") {
            let role = interaction.options.getRole('role')
            let rolePermArray = await role.permissions.toArray()

            const roleInfoEmbed = new EmbedBuilder()
            .setTitle(`Role Info | ${role.name}`)
            .addFields(
                { name: 'Name', value: `${role.name}`, inline: true },
                { name: 'ID', value: `${role.id}`, inline: true},
                { name: 'Color', value: `${role.hexColor.toString()}`, inline: true},
                { name: 'Mention', value: `\`<@&${role.id}>\``, inline: true},
                { name: 'Bumped', value: `${role.hoist=== true ? `Yes` : `No`}`, inline: true},
                { name: 'Position', value: `${role.position}`, inline: true},
                { name: 'Mentionable', value: `${role.mentionable === true ? `Yes` : `No`}`, inline: true},
                { name: 'Managed', value: `${role.managed === true ? `Yes` : `No`}`, inline: true},
                { name: 'Permissions', value: `${rolePermArray.join(' ')}`, inline: false},
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.avatarURL()})
            .setColor(role.hexColor)
            .setTimestamp()

            interaction.reply({ embeds: [roleInfoEmbed] })
        } else if (interaction.options.getSubcommand() === "bot") {
            let client = interaction.client
            let clientMember = await interaction.guild.members.fetchMe()

            const roleInfoEmbed = new EmbedBuilder()
            .setAuthor({ name: `Bot Info | ${client.user.username}`, iconURL: client.user.avatarURL()})
            .addFields(
                { name: 'API Ping', value: `${client.ws.ping}`, inline: true },
                { name: 'Memory Usage', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${(os.totalmem/ 1024 / 1024 / 1024).toFixed(1)} GB`, inline: true},
                { name: 'CPU Cores', value: `${os.cpus().length}`, inline: true},
                { name: 'Uptime', value: `${Math.round(client.uptime / (1000 * 60 * 60))} hours, ${Math.round(client.uptime / (1000 * 60)) % 60} minutes`, inline: true},
                { name: 'Node Version', value: `${process.version}`, inline: true},
                { name: 'Guilds', value: `${client.guilds.cache.size}`, inline: true}
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.avatarURL()})
            .setColor(clientMember.displayHexColor)
            .setTimestamp()

            interaction.reply({ embeds: [roleInfoEmbed] })
        }
        function mapRoles(tMember) {
            var mappedRoles = `<@&${tMember.roles.cache.map(r => r.id).join('>, <@&')}>`
            mappedRoles = mappedRoles.replace(`, <@&${interaction.guild.roles.everyone.id}>`, '')
            
            return mappedRoles
        }
    }
}