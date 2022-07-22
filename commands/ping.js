const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
	    .setName('ping')
	    .setDescription('Returns the ping of the bot.'),
    async execute(interaction) {
        const pingSEmbed = new EmbedBuilder()
        .setTitle(`:ping_pong: API Latency is currently at: ${client.ws.ping}ms.`)
        .setColor(0x5865F2)

        interaction.reply({ embeds: [pingSEmbed] })
    },
}