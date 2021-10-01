const Command = require("../structures/Command")

const { inspect } = require("util")
const { MessageEmbed } = require("discord.js")

class EvalCommand extends Command {

	constructor () {
		super("eval", ["evaluate"])

		this.onlyOwner = true
	}

	async run(message, args) {
		const code = args.join(" ")

		try {
			const evaluated = await eval(code)

			message.channel.send(inspect(evaluated, { depth: 0 }), { code: 'xl' })
		} catch (err) {
			const embed = new MessageEmbed()
				.setTitle("Um erro inesperado ocorreu enquanto o comando estava sendo executado!")
				.setDescription("```" + err.stack + "```")
				.setColor("RED")
				.setTimestamp(new Date())

			message.channel.send({ embeds: [embed] })
		}
	}

}

module.exports = EvalCommand