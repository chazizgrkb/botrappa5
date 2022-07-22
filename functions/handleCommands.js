const path = require('node:path')
const logger = require('beautiful-logs.js')

module.exports = (client) => {
    client.handleCommands = async (files, filesPath) => {
        for (const file of files) {
            const filePath = path.join(filesPath, file)
            const command = require(filePath)
        
            client.commands.set(command.data.name, command)

            logger.info(`Command ${file} registered`)
        }        
    }
}