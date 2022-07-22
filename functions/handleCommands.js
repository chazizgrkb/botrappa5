const { REST } = require('@discordjs/rest')
const { Routes } = require('discord.js')
const logger = require('beautiful-logs.js')
const { token, clientId } = require('../config')

module.exports = (client) => {
    client.handleCommands = async (commandFiles) => {
        logger.info(`COMMANDS  -----------`)

        const { commands, commandArray } = client;
        for (const file of commandFiles) {
            const command = require(`../commands/${file}`)
            commands.set(command.data.name, command)
            commandArray.push(command.data.toJSON())

            logger.info(`Command ${command.data.name} has been registered`)
        }

        const rest = new REST({ version: '9' }).setToken(token);
        try {
            logger.info("Slash command refresh started.")
            await rest.put(Routes.applicationCommands(clientId), { body: commandArray, })
            logger.success("Successfully reloaded slash commands.")
        } catch (error) {
            logger.err(error)
        }
    }
}