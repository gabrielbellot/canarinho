const Command = require("../structures/Command.js")
const { MessageEmbed } = require("discord.js")
const Axios = require("axios")

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

        let imageUrl;

        if (args.length > 0 && args[0] === "gif") {
            this.client.debug("O amigão pediu GIF!")
            imageUrl = await this.getImageUrl(true)
        } else {
            imageUrl = await this.getImageUrl(false)
        }

        let embed = new MessageEmbed().setColor("BLUE").setImage(imageUrl)
        message.channel.send(`${imageUrl}`)
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
            "gwpublic"
        ]

        let chosen = communities.random()
        this.client.debug("Chosen community: " + chosen)

        let imgUrl = await this.client.reddit.getSubreddit(chosen).getHot().random().url

        if (isGif && !imgUrl.endsWith("gif") && !(imgUrl.includes("redgifs"))) {
            this.client.debug("Quero um GIF, mas não recebi!")
            return this.getImageUrl(isGif)
        }

        if (!(imgUrl.includes("redgifs")) && !(imgUrl.endsWith("png")) && !(imgUrl.endsWith("jpg")) && !(imgUrl.endsWith("jpeg")) && (!imgUrl.endsWith("gif"))) {
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