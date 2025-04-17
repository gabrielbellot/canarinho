const Command = require("../structures/Command")

const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")

class AkinatorCommand extends Command {

    constructor () {
        super("akinator", ["aki"])
    }

    async run(message, args) {
        let embed = new MessageEmbed()
        embed.setTitle("🤔 Gênio Akinator")
        embed.setColor("YELLOW")
        embed.setTimestamp(new Date())
        embed.setThumbnail("https://play-lh.googleusercontent.com/rjX8LZCV-MaY3o927R59GkEwDOIRLGCXFphaOTeFFzNiYY6SQ4a-B_5t7eUPlGANrcw")
        embed.setDescription("Você deseja iniciar o jogo de adivinhação do Gênio Akinator? ✅ ou ❌")
        embed.setFooter(`${message.author.tag}`, message.author.avatarURL())

        let row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`${message.author.id}-akistartyes`)
                .setLabel("Sim")
                .setStyle("SUCCESS"),
            new MessageButton()
                .setCustomId(`${message.author.id}-akistartno`)
                .setLabel("Não")
                .setStyle("DANGER")
        )

        message.channel.send({  embeds: [embed], components: [row] })
    }

}

module.exports = AkinatorCommand