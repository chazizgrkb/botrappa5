const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
	    .setName('avatar')
	    .setDescription('Returns avatar of you, or specified person\'s avatar.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Returns avatar set on server profile, if they have one.')
                .addUserOption(option => option.setName('target').setDescription('Select a user'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Returns avatar set on account.')
                .addUserOption(option => option.setName('target').setDescription('Select a user'))
        ),
    async execute(interaction) {
        let target = interaction.options.getUser('target') || interaction.user

        if (interaction.options.getSubcommand() === 'user') {
            const avatarEmbed = new EmbedBuilder()
            .setAuthor({ name: `${target.tag}'s avatar`, iconURL: target.avatarURL() })
            .setImage(target.avatarURL({ dynamic: true }))
            .setColor(0x5865F2)

            interaction.reply({ embeds: [avatarEmbed] })
        } else if (interaction.options.getSubcommand() === 'server') {
            let members = await interaction.guild.members.fetch()
            let tMember = members.get(target.id)

            const avatarEmbed = new EmbedBuilder()
            .setAuthor({ name: `${target.tag}'s server avatar`, iconURL: tMember.displayAvatarURL() })
            .setImage(tMember.displayAvatarURL({ dynamic: true }))
            .setColor(0x5865F2)

            interaction.reply({ embeds: [avatarEmbed] })
        }
    },
}