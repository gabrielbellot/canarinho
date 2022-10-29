const Command = require("../structures/Command")
const Brasileirao = require("../utils/Brasileirao")
const { MessageEmbed, Message } = require("discord.js")

class BrasileiraoCommand extends Command {

    constructor () {
        super("brasileirao"/*, ["brasileiro"]*/)
    }

    async run(message, args) {
        const brasileirao = new Brasileirao()

        let optionsEmbed = new MessageEmbed()
            .setTitle("⚽ Campeonato Brasileiro de Futebol 2022")
            .setColor("DARK_GREEN")
            .setDescription("ℹ️ Dados providos pelo website oficial da **[CBF](https://www.cbf.com.br/futebol-brasileiro/competicoes)**\n🔹 Selecione abaixo a opção que gostaria de visualizar:\n\n🅰️ **Tabela Brasileirão Série A**\n🅱️ **Tabela Brasileirão Série B**\n\n⚽ **Artilheiros Série A**\n🥅 **Artilheiros Série B**")
            .setTimestamp(new Date())
            .setFooter("Atualizado ")

        let optionsMsg = await message.channel.send({ embeds: [optionsEmbed] })
        optionsMsg.react("🅰️")
        optionsMsg.react("🅱️")
        optionsMsg.react("⚽")
        optionsMsg.react("🥅")

        let division = ""
        let embedImg

        let optionsCollector = optionsMsg.createReactionCollector({ filter: (reaction, user) => !(user.bot) && user.id === message.author.id})
        optionsCollector.on("collect", async (r, author) => {
            if (r.emoji.name === "⚽") {
                optionsMsg.delete()
                let topScorers = await brasileirao.fetchTopScorers("A")

                let description = ""
                topScorers.forEach((scorer, idx) => {
                    switch (idx) {
                        case 0: description += "🥇 "; break
                        case 1: description += "🥈 "; break
                        case 2: description += "🥉 "; break
                    }

                    description += `**${idx + 1}º** - **[${scorer.name}](${scorer.webpage})** - **${scorer.team}** | **${scorer.goals}** gols ⚽\n\n`
                })

                let scorersEmbed = new MessageEmbed()
                    .setTitle("⚽ Campeonato Brasileiro Série A 2022 - Artilheiros")
                    .setDescription(description)
                    .setColor("DARK_GREEN")
                    .setTimestamp(new Date())
                    .setFooter("Atualizado ")
                    .setThumbnail("https://upload.wikimedia.org/wikipedia/pt/4/42/Campeonato_Brasileiro_S%C3%A9rie_A_logo.png")
                
                message.channel.send({ embeds: [scorersEmbed] })
            }

            if (r.emoji.name === "🥅") {
                optionsMsg.delete()
                let topScorers = await brasileirao.fetchTopScorers("B")

                let description = ""
                topScorers.forEach((scorer, idx) => {
                    switch (idx) {
                        case 0: description += "🥇 "; break
                        case 1: description += "🥈 "; break
                        case 2: description += "🥉 "; break
                    }

                    description += `**${idx + 1}º** - **[${scorer.name}](${scorer.webpage})** - **${scorer.team}** | **${scorer.goals}** gols ⚽\n\n`
                })

                let scorersEmbed = new MessageEmbed()
                    .setTitle("⚽ Campeonato Brasileiro Série B 2022 - Artilheiros")
                    .setDescription(description)
                    .setColor("DARK_GREEN")
                    .setTimestamp(new Date())
                    .setFooter("Atualizado ")
                    .setThumbnail("https://upload.wikimedia.org/wikipedia/pt/b/b2/Campeonato_Brasileiro_de_Futebol_S%C3%A9rie_B_2022.png")
                
                message.channel.send({ embeds: [scorersEmbed] })
            }

            if (r.emoji.name === "🅰️") {
                division = "A"
                embedImg = "https://upload.wikimedia.org/wikipedia/pt/4/42/Campeonato_Brasileiro_S%C3%A9rie_A_logo.png"
            } else if (r.emoji.name === "🅱️") {
                division = "B"
                embedImg = "https://upload.wikimedia.org/wikipedia/pt/b/b2/Campeonato_Brasileiro_de_Futebol_S%C3%A9rie_B_2022.png"
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

            let tableEmbed1 = new MessageEmbed()
                .setTitle("⚽ Campeonato Brasileiro Série " + division + " 2022 - Tabela")
                .setDescription(description1)
                .setColor("DARK_GREEN")
                .setThumbnail(embedImg)
                .setFooter("Atualizado ")
                .setTimestamp(new Date())
            
            let tableEmbed2 = new MessageEmbed()
                .setTitle("⚽ Campeonato Brasileiro Série " + division + " 2022 - Tabela")
                .setDescription(description2)
                .setColor("DARK_GREEN")
                .setThumbnail(embedImg)
                .setFooter("Atualizado ")
                .setTimestamp(new Date())

            let msg = await message.channel.send({ embeds: [tableEmbed1] })
            await msg.react(`▶️`)

            let collector = msg.createReactionCollector({ filter: (reaction, user) => !(user.bot) && user.id === message.author.id})
            collector.on("collect", async (reaction, user) => {
                if (reaction.emoji.name === "▶️") {
                    msg.edit({ embeds: [tableEmbed2] })
                    msg.reactions.removeAll()
                    msg.react("◀️")
                }

                if (reaction.emoji.name === "◀️") {
                    msg.edit({ embeds: [tableEmbed1] })
                    msg.reactions.removeAll()
                    msg.react("▶️")
                }
            })
        })
    }
}

module.exports = BrasileiraoCommand