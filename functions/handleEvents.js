const path = require('node:path')
const logger = require('beautiful-logs.js')

module.exports = (client) => {
    client.handleEvents = async (files, filesPath) => {
        for (const file of files) {
            const filePath = path.join(filesPath, file);
            const event = require(filePath);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }

            logger.info(`Event ${file} registered`)
        }
    }
}