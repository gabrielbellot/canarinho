const Command = require("../structures/Command")

class WPMCommand extends Command {

    constructor () { 
        super("wpm", ["palavras", "ppm"]) 
    }

    async run(message, args) {
        const phrase = this.getPhrase()
        const normalized = this.normalize(phrase).replace("\u200B", "")
        const phraseLength = phrase.split(" ").length

        message.reply("Escreva a seguinte frase dentro de **30** segundos: ```" + phrase + "```")
        const millis = new Date().getTime()

        const collector = message.channel.createMessageCollector({ time:30000 })
        collector.on("collect", (m) => {
            if (m.author.id !== message.author.id)
                return

            collector.stop("Success")
            const proccessedContent = this.normalize(m.content)

            if (m.content.includes("\u200B")) {
                message.reply("Não é permitido copiar e colar a frase!")
                return
            }

            if (proccessedContent !== normalized) {
                message.reply("Você errou a frase!")
                return
            }
            
            const diff = new Date().getTime() - millis
            const seconds = diff / 1000
            const minutes = diff / 1000 / 60

            const wpm = Math.round(phraseLength / minutes)

            message.reply("Você acertou a frase e demorou **" + seconds + "** segundos para escrever **" + phraseLength + "** palavras!")
            message.reply("Isso significa que você escreveu aproximadamente **" + wpm + "** palavras por minuto!")
        })

        collector.on("end", (collected, r) => {
            if (r === "Success")
                return
                
            message.reply("Você não respondeu a tempo!")
        })
    }

    getPhrase() {
        let phrases = [
            "Quando você tem fé, o impossível começa a acontecer.",
            "Não apago os meus erros, por que eles escreveram os meus recomeços.",
            "A vida só vai para frente depois que você larga as coisas que te levam para trás.",
            "Amar é encontrar no outro a sua própria felicidade.",
            "Ele irá reduzir o tempo necessário para o nosso programa na inicialização.",
            "O presidente acaba de assinar o decreto autorizando o porte de armas.",
            "Vemos que a percepção das dificuldades garante a contribuição de um grupo importante.",
            "Que o vento leve o necessário e nos traga o suficiente.",
            "Não existem limites para nossos sonhos, basta acreditar!",
            "Por acaso você conhece aquela turma?",
            "Valoriza quem te valoriza pois existe quem só te procura quando precisa.",
            "Coisas pequenas se tornam gigantes quando feitas com amor."
        ]

        const selected = phrases[Math.round(Math.random() * (phrases.length - 1))]

        const proccessedPhrase = selected.split("").join("\u200B")

        return proccessedPhrase
    }

    normalize(phrase) {
        return phrase.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[,.;!?:]/g, "").replace(/[\u200B]/g, "").toLowerCase()
    }

}

module.exports = WPMCommand