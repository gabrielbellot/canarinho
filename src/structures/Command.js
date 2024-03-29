const { MessageEmbed } = require("discord.js")

class Command {

	constructor (label, aliases = []) {
		this.label = label
		this.aliases = aliases

		this.usage = ""

		this.onlyOwner = false
		this.memberPermissions = []
		this.botPermissions = []
	}

	run(message, args) {}

	register(client) {
		this.client = client

		client.commands.push(this)
	}

	async handle(message) {
		const rawArgs = message.content.toLowerCase().split(" ")
		const usedLabel = rawArgs[0]

		const prefix = process.env.PREFIX
		const labels = [this.label]

		this.aliases.forEach((alias) => {
			labels.push(alias)
		})

		const withPrefixLabels = labels.map((label) => prefix + label)

		if (withPrefixLabels.includes(usedLabel)) {
			try {
				const start = Date.now()
				this.client.info("[COMMAND EXECUTED]".yellow, `(${message.guild.name} -> #${message.channel.name}) ${message.author.tag}: ${message.content}`)

				message.channel.sendTyping()

				const args = rawArgs
				args.shift()

				/*const missingMemberPermissions = this.memberPermissions.filter((permission) => !message.member.hasPermission(permission))

				if (missingMemberPermissions.length !== 0) { // ;w;
					message.reply("Você não tem permissão para executar este comando!")
					return true
				}

				const missingBotPermissions = this.botPermissions.filter((permission) => !message.guild.member.hasPermission(permission))

				if (missingBotPermissions.length !== 0) {
					message.reply(`Eu não consigo executar este comando pois eu preciso das permissões \`${missingBotPermissions.join(", ")}\`!`)
					return true
				}*/

				if (this.onlyOwner && message.author.id !== process.env.OWNER_ID) {
					message.reply("Você não tem permissão para executar este comando!")
					return true
				}

				if (args[0] === "?") {
					this.explain(message)
					return true
				}

				await this.run(message, args)

				this.client.info("[COMMAND EXECUTED]".green, `(${message.guild.name} -> #${message.channel.name}) ${message.author.tag}: ${message.content} - OK! Finished in ${Date.now() - start}ms`)
			} catch (err) {
				message.reply("Um erro inesperado ocorreu enquanto eu tentava executar este comando! Desculpe-me.")

				this.client.error("[COMMAND EXECUTED]".green, `(${message.guild.name} -> #${message.channel.name}) ${message.author.tag}: ${message.content} - ERROR!\n${err.stack}`)
			}

			return true
		}

		return false
	}

	async explain(message) {
		const splitted = message.content.split(" ")

		const prefix = process.env.PREFIX

		const usedLabel = splitted[0].replace(process.env.PREFIX, "")
		const allLabels = [this.label]
		this.aliases.forEach((alias) => allLabels.push(alias))

		const unusedLabels = allLabels.filter((label) => label !== usedLabel)

		const embed = new MessageEmbed()

		embed.setAuthor(message.author.tag, message.author.displayAvatarURL)

		embed.setTitle(":thinking: `" + process.env.PREFIX + usedLabel + "`")

		embed.addField(":interrobang: Como usar?", `\`${prefix + usedLabel} ${this.usage}\``, false)
		embed.addField(":twisted_rightwards_arrows: Alternativas", `${unusedLabels.map((label) => "`" + process.env.PREFIX + label + "`").join(", ")}`, false)

		embed.setColor("BLURPLE")

		embed.setFooter("Executado")
		embed.setTimestamp(new Date())

		message.channel.send({ embeds: [embed] })
	}
}

module.exports = Command
