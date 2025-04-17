const Command = require("../structures/Command")

class ChatGPTCommand extends Command {

    constructor() {
        super("chatgpt")
    }

    async run(message, args) {

    }

}

module.exports = ChatGPTCommand