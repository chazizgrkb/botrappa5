const logger = require('beautiful-logs.js')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName)
    
        if (!command) return;
    
        try {
            await command.execute(interaction)
            logger.command(`${interaction.user.tag} (${interaction.user.id}) has used command ${interaction.commandName} in ${interaction.guild.name}`)
        } catch (err) {
            logger.err(err)
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true})
        }
    }
}