const Command = require("../structures/Command.js")
const { MessageEmbed } = require("discord.js")
const Axios = require("axios")

class PutariaCommand extends Command {

    constructor() {
        super("putaria")
    }

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
        message.channel.send(`${imageUrl}`/*{ embeds: [embed] }*/)
    }

    async getImageUrl(isGif = false) {
        let communities = [
            "pussy",
            "boobs",
            "boobies",
            "barelylegalteens",
            "blonde",
            "redheads",
            "gifsgonewild"
        ]

        let chosen = communities.random()
        this.client.debug("Chosen community: " + chosen)

        let request = await Axios.get("https://www.reddit.com/r/" + chosen + "/random/.json")
        let body = request.data
        let post = body[0].data.children[0].data

        if (isGif && !post.url.endsWith("gif")) {
            this.client.debug("Quero um GIF, mas não recebi!")
            return this.getImageUrl(isGif)
        }

        if (!(post.url.endsWith("png")) && !(post.url.endsWith("jpg")) && !(post.url.endsWith("jpeg")) && (!post.url.endsWith("gif"))) {
            this.client.debug("Não recebi nem um PNG, nem JPG, nem GIF!!!!")
            return this.getImageUrl(isGif)
        }

        console.log(`${post.url}`)
        return post.url
    }
}

module.exports = PutariaCommand