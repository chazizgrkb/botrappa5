const fs = require('node:fs')
const path = require('node:path')
const { Client, GatewayIntentBits, Collection } = require('discord.js')
const logger = require('beautiful-logs.js')
const { token } = require('./config')

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)

    client.commands.set(command.data.name, command)
}

client.once('ready', () => {
	logger.boot("Botrappa 5 is ready!")
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName)

    if (!command) return;

    try {
        await command.execute(interaction)
        logger.command(`${interaction.user.tag} (${interaction.user.id}) has used command ${interaction.commandName} in ${interaction.guild.name}`)
    } catch (err) {
        logger.err(err)
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true})
    }
})

client.login(token)