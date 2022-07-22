const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
	    .setName('avatar')
	    .setDescription('Returns executor\'s avatar'),
    async execute(interaction) {
        const avatarEmbed = new EmbedBuilder()
        .setAuthor({ name: `${interaction.user.tag}'s avatar.`, iconURL: interaction.user.avatarURL() })
        .setImage(interaction.user.avatarURL({ dynamic: true }))
        .setColor(0x5865F2)

        interaction.reply({ embeds: [avatarEmbed] })
    },
}