const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const Command = require("../structures/Command")
const Brasileirao = require("../utils/Brasileirao")

class BrasileiraoCommand extends Command {
    constructor() {
        super("brasileirao")
    }

    async run(message) {
        const brasileirao = new Brasileirao()

        const optionsEmbed = new MessageEmbed()
            .setTitle("🏆 Campeonato Brasileiro de Futebol - 2025")
            .setColor("GREEN")
            .setDescription(
                "👋 Fala, craque! Acompanhe tudo do **Brasileirão Série A 2025** com dados oficiais da [CBF](https://www.cbf.com.br/futebol-brasileiro/competicoes).\n\n" +
                "📊 Escolha abaixo o que você quer ver:\n\n" +
                "🔷 **Tabela da Série A**\n" +
                "⚽ **Top Artilheiros da Série A**"
            )
            .setFooter({ text: "🔄 Dados atualizados em tempo real" })
            .setTimestamp()

        const row = new MessageActionRow().addComponents(
            new MessageButton().setCustomId('serieA_' + message.author.id).setLabel('📊 Série A').setStyle('PRIMARY'),
            new MessageButton().setCustomId('scorersA_' + message.author.id).setLabel('⚽ Artilheiros A').setStyle('SUCCESS')
        )

        const sentMsg = await message.channel.send({ embeds: [optionsEmbed], components: [row] })

        const collector = sentMsg.createMessageComponentCollector({
            filter: i => i.user.id === message.author.id,
            time: 60000
        })

        collector.on('collect', async interaction => {
            const id = interaction.customId.split('_')[0] // Pega o identificador sem o timestamp

            if (id.startsWith('scorers')) {
                const division = 'A'
                const scorers = await brasileirao.fetchTopScorers(division)

                const embed = new MessageEmbed()
                    .setTitle(`🥅 Artilharia - Série ${division} (2025)`)
                    .setColor("GOLD")
                    .setThumbnail("https://upload.wikimedia.org/wikipedia/pt/4/42/Campeonato_Brasileiro_S%C3%A9rie_A_logo.png")
                    .setDescription(scorers.map((s, i) => `**${i + 1}º |** ${getMedal(i)} **${s.name}** - ⚽ **${s.goals} gols**\n${getTeamEmoji(s.team)} ${s.team}`).join("\n\n"))
                    .setFooter({text: "📈 Atualizado com dados da rodada mais recente"})
                    .setTimestamp()

                await interaction.update({embeds: [embed], components: []}) // Atualiza a mensagem original sem criar novas
            }

            if (id.startsWith('serie')) {
                const division = 'A'
                const table = await brasileirao.fetchTable(division)

                const createTableDescription = (start, end) =>
                    table.slice(start, end).map((team, idx) => {
                        let position = start + idx + 1
                        let modifier = ""
                        if (position <= 4) { // Times do G4
                            modifier = "<:libertadores:1362521574288396388> "
                        } else if (position > 4 && position <= 6) { // Times do G6 (5º e 6º)
                            modifier = "<:libertadores:1362521574288396388> "
                        } else if (position > 6 && position <= 12) { // Times da Sulamericana
                            modifier ="<:sudamericana:1362522189043077342> "
                        } else if (position >= 17) { // Times na Zona de Rebaixamento
                            modifier = "🅱️ "
                        }

                        return `${modifier}**${start + idx + 1}º** - **${getTeamEmoji(team.name)} ${team.name}** \n` +
                            `✅ PJ: **${team.matches}** | 🟢 V: **${team.matchesWon}** | 🟡 E: **${team.matchesTied}** | 🔴 D: **${team.matchesLost}** | 🥅 SG: **${team.goalsDifference}** | ⭐ **${team.points}** pts\n`
                        }
                    ).join("\n")

                const embed1 = new MessageEmbed()
                    .setTitle(`📋 Tabela - Série ${division} (Parte 1)`)
                    .setColor("GREEN")
                    .setDescription("🔥 A briga tá pegando fogo! Confira os **10 primeiros colocados**:\n\n" + createTableDescription(0, 10))
                    .setThumbnail("https://upload.wikimedia.org/wikipedia/pt/4/42/Campeonato_Brasileiro_S%C3%A9rie_A_logo.png")
                    .setFooter({text: "📈 Atualizado com dados da rodada mais recente"})
                    .setTimestamp()

                const embed2 = new MessageEmbed()
                    .setTitle(`📋 Tabela - Série ${division} (Parte 2)`)
                    .setColor("GREEN")
                    .setDescription("⚠️ Agora os times da parte de baixo. Será que escapam do Z4?\n\n" + createTableDescription(10, 20))
                    .setThumbnail("https://upload.wikimedia.org/wikipedia/pt/4/42/Campeonato_Brasileiro_S%C3%A9rie_A_logo.png")
                    .setFooter({text: "📈 Atualizado com dados da rodada mais recente"})
                    .setTimestamp()

                let currentPage = 1

                const getNavRow = () => new MessageActionRow().addComponents(
                    new MessageButton().setCustomId('prevPage').setLabel('⬅️ Voltar').setStyle('SECONDARY').setDisabled(currentPage === 1),
                    new MessageButton().setCustomId('nextPage').setLabel('Avançar ➡️').setStyle('SECONDARY').setDisabled(currentPage === 2)
                )

                await interaction.update({embeds: [embed1], components: [getNavRow()]})

                const navCollector = interaction.message.createMessageComponentCollector({
                    filter: i => i.user.id === message.author.id,
                    time: 60000
                })

                navCollector.on('collect', async btn => {
                    if (btn.customId === 'nextPage') {
                        currentPage = 2
                        await btn.update({embeds: [embed2], components: [getNavRow()]})
                    } else if (btn.customId === 'prevPage') {
                        currentPage = 1
                        await btn.update({embeds: [embed1], components: [getNavRow()]})
                    }
                })
            }

            function getMedal(index) {
                return ["🥇", "🥈", "🥉", "🎖️", "🏅"][index] || "🔸"
            }

            function getTeamEmoji(teamName) {
                const teamEmojis = {
                    "CR Flamengo": "<:flamengo:1362512257048907856>",
                    "SE Palmeiras": "<:palmeiras:1362512261620695261>",
                    "Botafogo FR": "<:botafogo:1362512267882795218>",
                    "Fortaleza EC": "<:fortaleza:1362512270487195799>",
                    "Ceará SC": "<:ceara:1362513484578820347>",
                    "RB Bragantino": "<:bragantino:1362514820255187074>",
                    "CR Vasco da Gama": "<:vasco:1362514822360600647>",
                    "Mirassol FC": "<:mirassol:1362514826705768630>",
                    "SC Internacional": "<:internacional:1362514829172277288>",
                    "Santos FC": "<:santos:1362514832091513013>",
                    "SC Corinthians Paulista": "<:corinthians:1362514839179628586>",
                    "EC Vitória": "<:vitoria:1362514841817977022>",
                    "São Paulo FC": "<:saopaulo:1362514845957619824>",
                    "Grêmio FBPA": "<:gremio:1362514847824351545>",
                    "Cruzeiro EC": "<:cruzeiro:1362515664363065546>",
                    "CA Mineiro": "<:atleticomg:1362515788778700890>",
                    "SC Recife": "<:sport:1362515893350957149>",
                    "Fluminense FC": "<:fluminense:1362517511819759666>",
                    "EC Juventude": "<:juventude:1362518810309165056>"
                }
                return teamEmojis[teamName] || "⚪";
            }
        })
    }
}
module.exports = BrasileiraoCommand
