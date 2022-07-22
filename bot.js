const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const logger = require('beautiful-logs.js');
const { token } = require('./config');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Command path & collection
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Event path
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

// Functions path
const functionsPath = path.join(__dirname, 'functions');
const functionFiles = fs.readdirSync(functionsPath).filter(file => file.endsWith('.js'));

(async () => {
    logger.info(`FUNCTIONS -----------`)
    for (const file of functionFiles) {
        const filePath = path.join(functionsPath, file);
        require(filePath)(client);
        logger.info(`Function ${file} registed!`)
    }
    logger.info(`COMMANDS  -----------`)
    client.handleCommands(commandFiles, commandsPath)

    logger.info(`EVENTS    -----------`)
    client.handleEvents(eventFiles, eventsPath)

    client.login(token)
})();