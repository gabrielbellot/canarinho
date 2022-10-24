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

        let imageUrl = await this.getImageUrl()

        let embed = new MessageEmbed().setColor("BLUE").setImage(imageUrl)
        message.channel.send({ embeds: [embed] })
    }

    async getImageUrl() {
        let request = await Axios.get("https://www.reddit.com/r/cumsluts/random/.json")
        let body = request.data
        let post = body[0].data.children[0].data
        if (!(post.url.endsWith("png")) && !(post.url.endsWith("jpg")) && !(post.url.endsWith("jpeg")))
            return this.getImageUrl()

        return post.url
    }
}

module.exports = PutariaCommand