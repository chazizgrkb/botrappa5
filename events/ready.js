const logger = require('beautiful-logs.js')

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        logger.boot(`Bot is ready! Logged in as ${client.user.tag}`)
    }
}