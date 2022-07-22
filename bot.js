const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const logger = require('beautiful-logs.js');
const { token } = require('./config');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
client.commandArray = [];

const commandFiles = fs.readdirSync(`./commands`).filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync(`./events`).filter(file => file.endsWith('.js'));
const functionFiles = fs.readdirSync(`./functions`).filter(file => file.endsWith('.js'));

// Initialization 
logger.info(`FUNCTIONS -----------`)
for (const file of functionFiles) { require(`./functions/${file}`)(client); logger.info(`Function ${file} registed!`); }

client.handleCommands(commandFiles)
client.handleEvents(eventFiles)

client.login(token)