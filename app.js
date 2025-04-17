require("dotenv").config()

if (!process.env.TOKEN) {
	console.error("Você não definiu a variável \"TOKEN\" no \".env\"!")
	process.exit(1)
}

process.on("uncaughtException", (err) => {
	console.log("Erro GRAVE! " + err)
})

const { Intents } = require("discord.js")
const token = process.env.TOKEN
const Canarinho = require("./src/Canarinho")

const bot = new Canarinho({ intents: new Intents(32767) })
bot.start(token)