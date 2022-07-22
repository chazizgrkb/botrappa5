const fs = require('node:fs')
const path = require('node:path')
const { Client, GatewayIntentBits, Collection } = require('discord.js')
const logger = require('beautiful-logs.js')
const { token } = require('./config')

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

// Command path & collection
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

// Event path
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

// Command Handler
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)

    client.commands.set(command.data.name, command)
}

// Event Handler
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token)