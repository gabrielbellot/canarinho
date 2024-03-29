const Command = require("../structures/Command.js")
const { MessageEmbed } = require("discord.js")

class PutariaCommand extends Command {

    constructor() {
        super("putaria")
    }

    sentPicsCache = []

    async run(message, args) {
        if (!message.channel.nsfw) {
            message.reply("O canal <#" + message.channel + "> não permite conteúdo impróprio!")
            return
        }

        this.sendMessage(message, args.length > 0 && args[0] === "gif")
    }

    async sendMessage(message, gif = false) {
        let imageUrl = await this.getImageUrl(gif)
        let embed = new MessageEmbed()
            .setColor("RED")
            .setImage(imageUrl)
            .setFooter("🔥")
            .setTimestamp(new Date())

        let msg = await message.channel.send({ content: `<@${message.author.id}>`,  embeds: [embed] })
        await msg.react("🔁")
        await msg.react("❌")

        let collector = msg.createReactionCollector({ filter: (reaction, user) => !(user.bot) && user.id === message.author.id})
        collector.on("collect", async (r, author) => {
            if (r.emoji.name === "❌") {
                await msg.delete()
                return
            }

            if (r.emoji.name !== "🔁" || r.message.id !== msg.id) 
                return
            
            collector.stop()

            await message.channel.sendTyping()
            this.sendMessage(message, gif)
        })
    }

    async getImageUrl(isGif = false) {
        let communities = [
            "pussy",
            "boobs",
            "boobies",
            "barelylegalteens",
            "blonde",
            "redheads",
            "gifsgonewild",
            "gonewild",
            "gonewildcouples",
            "tittydrop",
            "tits",
            "titties",
            "latinas",
            "latinacuties",
            "gwpublic",
            "collegesluts",
            "flashinggirls",
            "adorablenudes",
            "playboy",
            "publicflashing"
        ]

        let chosen = communities.random()
        this.client.debug("Chosen community: " + chosen)

        let imgUrl = await this.client.reddit.getSubreddit(chosen).getHot().random().url

        if (isGif && !imgUrl.endsWith("gif") && !imgUrl.endsWith("gifv") /*&& !(imgUrl.includes("redgifs"))*/) {
            this.client.debug("Quero um GIF, mas não recebi!")
            return this.getImageUrl(isGif)
        }

        if (/*!(imgUrl.includes("redgifs")) && */!(imgUrl.endsWith("png")) && !(imgUrl.endsWith("jpg")) && !(imgUrl.endsWith("jpeg")) && (!imgUrl.endsWith("gif"))) {
            this.client.debug("Não recebi nem um PNG, nem JPG, nem GIF, nem REDGIFS!!!!")
            this.client.debug("O que recebi? " + imgUrl)
            return this.getImageUrl(isGif)
        }

        if (this.sentPicsCache.includes(imgUrl)) {
            this.client.debug("A imagem recebida já está nas últimas 15 imagens enviadas! Tentando buscar outra...")
            return this.getImageUrl(isGif)
        }

        this.sentPicsCache.push(imgUrl)
        if (this.sentPicsCache.length > 20) {
            this.sentPicsCache = []
        }

        this.client.debug("Image URL : " + imgUrl)
        return imgUrl
    }
}

module.exports = PutariaCommand