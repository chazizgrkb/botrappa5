const path = require('node:path')
const logger = require('beautiful-logs.js')

module.exports = (client) => {
    client.handleEvents = async (files) => {
        logger.info(`EVENTS    -----------`)
        for (const file of files) {
            const event = require(`../events/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }

            logger.info(`Event ${event.name} registered`)
        }
    }
}