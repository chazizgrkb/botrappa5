const { ActivityType } = require('discord.js')
const logger = require('beautiful-logs.js')

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        logger.boot(`Bot is ready! Logged in as ${client.user.tag}`)
        client.user.setPresence({ 
            activities: [{ name: `for commands in ${client.guilds.cache.size} servers!`, type: ActivityType.Watching }],
            status: 'dnd'
        });
    }
}