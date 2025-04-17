const Command = require("../structures/Command");

class WPMCommand extends Command {

    constructor () {
        super("wpm", ["palavras", "ppm"]);
    }

    async run(message, args) {
        const phrase = this.getPhrase();
        const normalized = this.normalize(phrase).replace("\u200B", "");
        const phraseLength = phrase.split(" ").length;

        message.reply(`Escreva a seguinte frase dentro de **30** segundos: ⌨️🏃‍♂️‍➡️🕐 \n\n\`\`\`${phrase}\`\`\``);
        const millis = new Date().getTime();

        const collector = message.channel.createMessageCollector(m => (m.author.id === message.author.id), { time: 30000 });

        collector.on("collect", (m) => {
            if (m.author.id !== message.author.id)
                return

            collector.stop("Success");
            const processedContent = this.normalize(m.content);

            // Verificação de copiar e colar
            if (m.content.includes("\u200B")) {
                message.reply("🚫 **Não é permitido copiar e colar a frase!**");
                return;
            }

            // Verificação de erro na frase
            if (processedContent !== normalized) {
                message.reply("❌ **Você errou a frase! Tente novamente.**");
                return;
            }

            // Cálculo do tempo de digitação
            const diff = new Date().getTime() - millis;
            const seconds = diff / 1000;
            const minutes = diff / 1000 / 60;

            const wpm = Math.round(phraseLength / minutes);
            const difficultyScore = this.calculateDifficultyScore(phrase); // Ajustando a pontuação

            message.reply(`✅ **Você acertou a frase em ${seconds.toFixed(2)} segundos!**\n✨ Isso significa que você escreveu aproximadamente **${wpm} palavras por minuto (WPM)**!\n💡 **Pontuação de Dificuldade**: ${difficultyScore} pontos. Quanto mais difícil a frase, maior a pontuação!`);
        });

        collector.on("end", (collected, r) => {
            if (r === "Success")
                return;

            message.reply("⏰ **Você não respondeu a tempo! Tente novamente.**");
        });
    }

    getPhrase() {
        let phrases = [
            { text: "Quando você tem fé, o impossível começa a acontecer.", difficulty: 1 },
            { text: "Não apago os meus erros, por que eles escreveram os meus recomeços.", difficulty: 2 },
            { text: "A vida só vai para frente depois que você larga as coisas que te levam para trás.", difficulty: 3 },
            { text: "Amar é encontrar no outro a sua própria felicidade.", difficulty: 2 },
            { text: "Ele irá reduzir o tempo necessário para o nosso programa na inicialização.", difficulty: 3 },
            { text: "O presidente acaba de assinar o decreto autorizando o porte de armas.", difficulty: 3 },
            { text: "Vemos que a percepção das dificuldades garante a contribuição de um grupo importante.", difficulty: 3 },
            { text: "Que o vento leve o necessário e nos traga o suficiente.", difficulty: 2 },
            { text: "Não existem limites para nossos sonhos, basta acreditar!", difficulty: 1 },
            { text: "Por acaso você conhece aquela turma?", difficulty: 1 },
            { text: "Valoriza quem te valoriza pois existe quem só te procura quando precisa.", difficulty: 2 },
            { text: "Coisas pequenas se tornam gigantes quando feitas com amor.", difficulty: 2 },
            { text: "A tecnologia pode ser tanto uma aliada quanto uma ameaça, dependendo do uso.", difficulty: 3 },
            { text: "Seja a mudança que você deseja ver no mundo.", difficulty: 1 },
            { text: "O conhecimento é a única riqueza que ninguém pode tirar de você.", difficulty: 2 },
            { text: "Caminhar em meio ao caos exige coragem, paciência e sabedoria.", difficulty: 3 },
            { text: "O sucesso é a soma de pequenos esforços repetidos diariamente.", difficulty: 2 },
            { text: "Às vezes, é preciso se perder para se encontrar de verdade.", difficulty: 2 },
            { text: "Nem todos que vagam estão perdidos.", difficulty: 1 },
            { text: "A simplicidade é o último grau de sofisticação.", difficulty: 2 },
            { text: "Grandes ideias surgem da observação dos pequenos detalhes.", difficulty: 3 },
            { text: "O tempo é o recurso mais precioso que possuímos.", difficulty: 2 },
            { text: "Persistência é o caminho do êxito, mesmo diante do fracasso.", difficulty: 2 },
            { text: "Seja gentil, pois cada pessoa enfrenta batalhas que você não vê.", difficulty: 2 },
            { text: "O aprendizado começa quando saímos da zona de conforto.", difficulty: 2 }
        ];

        const selected = phrases[Math.floor(Math.random() * phrases.length)];

        const processedPhrase = selected.text.split("").join("\u200B");
        this.currentDifficulty = selected.difficulty;

        return processedPhrase;
    }

    normalize(phrase) {
        return phrase.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[,.;!?:]/g, "").replace(/[\u200B]/g, "").toLowerCase();
    }

    // Função para calcular a pontuação de dificuldade com base no nível da frase
    calculateDifficultyScore(phrase) {
        // A pontuação é baseada na dificuldade da frase e no número de palavras
        const difficultyMultiplier = this.currentDifficulty * 2;
        const phraseLength = phrase.split(" ").length;
        return Math.round(difficultyMultiplier * phraseLength);
    }
}

module.exports = WPMCommand;
