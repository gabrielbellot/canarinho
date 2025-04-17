const EventListener = require("../structures/EventListener")

const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const { Aki } = require("aki-api")

class AkinatorListener extends EventListener {

    constructor () {
        super("interactionCreate")
    }

    akinatorInstances = {}

    async run(i) {
        if (!i.customId.includes("aki")) return

        if (i.customId.split("-")[0] !== i.user.id) {
            i.reply({ content: `Use \`${process.env.PREFIX}akinator\` para iniciar o seu jogo de adivinhação com o Akinator!`, ephemeral: true })
            return
        }
    
        if (i.customId === i.user.id + "-akistartyes") {
            i.message.delete()
            i.deferReply()
    
            let region = "pt"
            let childMode = false // O AKINATOR ADIVINHOU A MIA KHALIFA AHAHAHAHAHAHAHA 
            const aki = new Aki({ region, childMode })
    
            await aki.start()
            this.akinatorInstances[i.user.id] = aki
    
            let embed = this.generateAkinatorEmbed(aki, i)
    
            let row = new MessageActionRow()
            aki.answers.forEach(a => row.addComponents(
                new MessageButton()
                    .setCustomId(`${i.user.id}-akianswer-${aki.answers.indexOf(a)}`)
                    .setLabel(a)
                    .setStyle("PRIMARY")
            ))
    
            i.editReply({ embeds: [embed], components: [row] })
            return
        }
    
        if (i.customId === i.user.id + "-akistartno") {
            i.message.delete()
            return
        }
    
        let idWithoutUser = i.customId.replace(`${i.user.id}-`, "")
        let aki = this.akinatorInstances[i.user.id]
    
        if (idWithoutUser.startsWith("akianswer-")) {
            await i.deferUpdate()
            let row = new MessageActionRow()
            aki.answers.forEach(a => row.addComponents(
                new MessageButton()
                    .setCustomId(`${i.user.id}-akianswer-${aki.answers.indexOf(a)}`)
                    .setLabel(a)
                    .setStyle("PRIMARY")
            ))
    
            let answer = i.customId.replace("akianswer-", "").replace(`${i.user.id}-`, "")
            await aki.step(answer)
    
            if (aki.progress >= 85 || aki.currentStep >= 79) {
                await aki.win()
    
                let embed = new MessageEmbed()
                    .setTitle("🤔 Gênio Akinator")
                    .setColor("YELLOW")
                    .setTimestamp(new Date())
                    .setThumbnail("https://play-lh.googleusercontent.com/rjX8LZCV-MaY3o927R59GkEwDOIRLGCXFphaOTeFFzNiYY6SQ4a-B_5t7eUPlGANrcw")
                    .setDescription(`**EU ACHO QUE É...**\n${aki.answers[0].name}\n\n✅ **Acertei?**`)
                    .setImage(aki.answers[0].absolute_picture_path)
                    .setFooter(`${i.user.tag}`, i.user.avatarURL())
    
                i.editReply({ embeds: [embed], components: [
                    new MessageActionRow().addComponents(
                        new MessageButton()
                            .setCustomId(`${i.user.id}-akiguess-right`)
                            .setLabel("Sim!")
                            .setStyle("SUCCESS"),
                        new MessageButton()
                            .setCustomId(`${i.user.id}-akiguess-wrong`)
                            .setLabel("Não!")
                            .setStyle("DANGER")
                    )
                ]})
    
                return
            }
    
            i.editReply({ embeds: [this.generateAkinatorEmbed(aki, i)], components: [row] })
        }
    
        
        if (idWithoutUser.startsWith("akiguess-")) {
            let guess = i.customId.replace("akiguess-", "").replace(`${i.user.id}-`, "")
    
            if (guess === "right") {
                await i.deferUpdate()
    
                let embed = new MessageEmbed()
                    .setTitle("🤔 Gênio Akinator")
                    .setColor("GREEN")
                    .setTimestamp(new Date())
                    .setThumbnail("https://play-lh.googleusercontent.com/rjX8LZCV-MaY3o927R59GkEwDOIRLGCXFphaOTeFFzNiYY6SQ4a-B_5t7eUPlGANrcw")
                    .setDescription(`**ACERTEI!**\n\nDepois de **${aki.currentStep}** perguntas, descobri que ${i.user} estava pensando em:\n**${aki.answers[0].name}**`)
                    .setImage(aki.answers[0].absolute_picture_path)
                    .setFooter(`${i.user.tag}`, i.user.avatarURL())
    
                i.editReply({ embeds: [embed], components: [] })
            } else if (guess === "wrong") {
                await i.deferUpdate()
    
                let embed = new MessageEmbed()
                    .setTitle("🤔 Gênio Akinator")
                    .setColor("RED")
                    .setTimestamp(new Date())
                    .setThumbnail("https://i.imgur.com/PQl6q8h.png")
                    .setDescription(`**DROGA!...**\n\n${i.user}, você ganhou... Eu adivinhei a personalidade errada depois de fazer **${aki.currentStep}** perguntas!`)
                    .setFooter(`${i.user.tag}`, i.user.avatarURL())
                
                i.editReply({ embeds: [embed], components: [] })
            }
        }
    }

    generateAkinatorEmbed(aki, i) {
        let progressDivided = aki.progress / 10
        let percentageArt = "=========="
        
        if (aki.progress > 10) {
            percentageArt = "**" + percentageArt.slice(0, progressDivided) + "**" + percentageArt.slice(progressDivided, percentageArt.length)
        }
    
        return new MessageEmbed()
            .setTitle("🤔 Gênio Akinator")
            .setColor("YELLOW")
            .setTimestamp(new Date())
            .setThumbnail("https://play-lh.googleusercontent.com/rjX8LZCV-MaY3o927R59GkEwDOIRLGCXFphaOTeFFzNiYY6SQ4a-B_5t7eUPlGANrcw")
            .setDescription(`**${aki.question}**\nProgresso: ${aki.progress}% - [${percentageArt}]`)
            .setFooter(`${i.user.tag}`, i.user.avatarURL())
    }
}

module.exports = AkinatorListener