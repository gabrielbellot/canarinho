const EventListener = require("../structures/EventListener")

class MessageListener extends EventListener {

	constructor () {
		super("messageCreate")
	}

	run(message) {
		if (message.author.bot)
			return

		if (message.content === `<@${this.client.user.id}>` || message.content === `<@!${this.client.user.id}>`) {
			message.reply("Olá! Eu sou o Canarinho! Use `" + process.env.PREFIX + "help` para obter ajuda!")
		}

		this.client.commands.forEach((command) => {
			if (command.handle(message))
				return
		})
	}
}

module.exports = MessageListener