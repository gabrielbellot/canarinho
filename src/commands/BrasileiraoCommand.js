const Command = require("../structures/Command")
const Brasileirao = require("../utils/Brasileirao")
const { MessageEmbed } = require("discord.js")

class BrasileiraoCommand extends Command {

    constructor () {
        super("brasileirao"/*, ["brasileiro"]*/)
    }

    async run(message, args) {
        const brasileirao = new Brasileirao()
        if (args[0] === "emoji") {
            brasileirao.createTeamEmojis(message.guild)
            return
        }

        let table = await brasileirao.fetchTable("A")

        let description1 = ""
        let description2 = ""
        table.forEach((team, idx) => {
            if (idx < 10) {
                description1 += `**${idx + 1}º** -** ${team.name}** - **${team.points}** pontos\n**✅ PJ:** ${team.matches} | **🟢 V:** ${team.matchesWon} | **🟡 E:** ${team.matchesTied} | **🔴 D:** ${team.matchesLost}\n\n`
            }

            if (idx >= 10) {
                description2 += `**${idx + 1}º** -** ${team.name}** - **${team.points}** pontos\n**✅ PJ:** ${team.matches} | **🟢 V:** ${team.matchesWon} | **🟡 E:** ${team.matchesTied} | **🔴 D:** ${team.matchesLost}\n\n`
            }
        })

        let embed1 = new MessageEmbed()
            .setTitle("⚽ Campeonato Brasileiro 2022 - Série A - Tabela")
            .setDescription(description1)
            .setColor("GREEN")
            .setThumbnail("https://upload.wikimedia.org/wikipedia/pt/4/42/Campeonato_Brasileiro_S%C3%A9rie_A_logo.png")
            
        let embed2 = new MessageEmbed()
            .setTitle("⚽ Campeonato Brasileiro 2022 - Série A - Tabela")
            .setDescription(description2)
            .setColor("GREEN")
            .setThumbnail("https://upload.wikimedia.org/wikipedia/pt/4/42/Campeonato_Brasileiro_S%C3%A9rie_A_logo.png")

        let msg = await message.channel.send({ embeds: [embed1] })
        // ▶️ ◀️
        await msg.react(`▶️`)

        let collector = msg.createReactionCollector({ filter: (reaction, user) => !(user.bot) && user.id === message.author.id})
        collector.on("collect", async (reaction, user) => {
            if (reaction.emoji.name === "▶️") {
                msg.edit({ embeds: [embed2] })
                msg.reactions.removeAll()
                msg.react("◀️")
            }

            if (reaction.emoji.name === "◀️") {
                msg.edit({ embeds: [embed1] })
                msg.reactions.removeAll()
                msg.react("▶️")
            }
        })
    }
}

module.exports = BrasileiraoCommand