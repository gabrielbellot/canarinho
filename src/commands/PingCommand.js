const Command = require("../structures/Command")

class PingCommand extends Command {

	constructor () {
		super("ping")
	}

	run(message, args) {
		message.reply(`**Pong!** :ping_pong: \`${message.client.ws.ping}ms\``)
	}

}

module.exports = PingCommand