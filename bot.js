const fs = require('node:fs')
const path = require('node:path')
const { Client, GatewayIntentBits, Collection } = require('discord.js')
const logger = require('beautiful-logs.js')
const { token } = require('./config')

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

client.once('ready', () => {
	logger.boot("Botrappa 5 is ready!")
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction
})

client.login(token)