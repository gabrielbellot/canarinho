const Command = require("../structures/Command")
const Brasileirao = require("../utils/Brasileirao")
const { MessageEmbed } = require("discord.js")

class BrasileiraoCommand extends Command {

    constructor () {
        super("brasileirao"/*, ["brasileiro"]*/)
    }

    async run(message, args) {
        const brasileirao = new Brasileirao()

        let optionsEmbed = new MessageEmbed().setColor("DARK_GREEN").setDescription("🅰️ **Tabela Brasileirão Série A**\n\n🅱️ **Tabela Brasileirão Série B**")
        let optionsMsg = await message.channel.send({ embeds: [optionsEmbed] })
        optionsMsg.react("🅰️")
        optionsMsg.react("🅱️")

        let division = ""
        let embedImg

        let optionsCollector = optionsMsg.createReactionCollector({ filter: (reaction, user) => !(user.bot) && user.id === message.author.id})
        optionsCollector.on("collect", async (r, author) => {
            if (r.emoji.name === "🅰️") {
                division = "A"
                embedImg = "https://upload.wikimedia.org/wikipedia/pt/4/42/Campeonato_Brasileiro_S%C3%A9rie_A_logo.png"
            } else if (r.emoji.name === "🅱️") {
                division = "B"
                embedImg = "https://upload.wikimedia.org/wikipedia/pt/f/f4/Campeonato_Brasileiro_S%C3%A9rie_B_logo.png"
            } else {
                return
            }

            optionsMsg.delete()

            let table = await brasileirao.fetchTable(division)

            let description1 = ""
            let description2 = ""
            table.forEach((team, idx) => {
                if (idx < 10) {
                    description1 += `**${idx + 1}º** -** ${team.name}** - **${team.points}** pontos\n**✅ PJ:** ${team.matches} | **🟢 V:** ${team.matchesWon} | **🟡 E:** ${team.matchesTied} | **🔴 D:** ${team.matchesLost} | 🥅 **SG:** ${team.goalsDifference} \n\n`
                }

                if (idx >= 10) {
                    description2 += `**${idx + 1}º** -** ${team.name}** - **${team.points}** pontos\n**✅ PJ:** ${team.matches} | **🟢 V:** ${team.matchesWon} | **🟡 E:** ${team.matchesTied} | **🔴 D:** ${team.matchesLost} | 🥅 **SG:** ${team.goalsDifference} \n\n`
                }
            })

            let embed1 = new MessageEmbed()
                .setTitle("⚽ Campeonato Brasileiro Série " + division + " 2022 - Tabela")
                .setDescription(description1)
                .setColor("DARK_GREEN")
                .setThumbnail(embedImg)
                .setFooter("Atualizado ")
                .setTimestamp(new Date())
            
            let embed2 = new MessageEmbed()
                .setTitle("⚽ Campeonato Brasileiro Série " + division + " 2022 - Tabela")
                .setDescription(description2)
                .setColor("DARK_GREEN")
                .setThumbnail(embedImg)
                .setFooter("Atualizado ")
                .setTimestamp(new Date())

            let msg = await message.channel.send({ embeds: [embed1] })
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
        })
    }
}

module.exports = BrasileiraoCommand