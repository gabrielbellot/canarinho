const axios = require("axios")
const cheerio = require("cheerio")

class Brasileirao {

    async fetchTable(division) {
        let url 
        switch (division) {
            case "A": url = "https://www.cbf.com.br/futebol-brasileiro/competicoes/campeonato-brasileiro-serie-a"; break
            case "B": url = "https://www.cbf.com.br/futebol-brasileiro/competicoes/campeonato-brasileiro-serie-b"; break
            // Séries C e D são realizadas em outro formato - Não há tabela de pontos corridos como na primeira e na segunda divisão.
        }

        let table = []
        let request = await axios.get(url, {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36"})
        let body = request.data
        let $ = cheerio.load(body)

        for (let i = 1; i < 40; i++) {
            // Aparentemente o site da CBF ordena os times em indexes ímpares - Do 1 até o 39
            if (i % 2 === 0)
                continue
                
            let teamNameSelector = `#menu-panel > article > div.container > div > div > section.m-b-50.p-t-10.row > div.col-md-8.col-lg-9 > table > tbody > tr:nth-child(${i}) > td:nth-child(1) > span.hidden-xs`
            let teamPointsSelector = `#menu-panel > article > div.container > div > div > section.m-b-50.p-t-10.row > div.col-md-8.col-lg-9 > table > tbody > tr:nth-child(${i}) > th`
            let teamMatchesSelector = `#menu-panel > article > div.container > div > div > section.m-b-50.p-t-10.row > div.col-md-8.col-lg-9 > table > tbody > tr:nth-child(${i}) > td:nth-child(3)`
            let matchesWonSelector = `#menu-panel > article > div.container > div > div > section.m-b-50.p-t-10.row > div.col-md-8.col-lg-9 > table > tbody > tr:nth-child(${i}) > td:nth-child(4)`
            let matchesTiedSelector = `#menu-panel > article > div.container > div > div > section.m-b-50.p-t-10.row > div.col-md-8.col-lg-9 > table > tbody > tr:nth-child(${i}) > td:nth-child(5)`
            let matchesLostSelector = `#menu-panel > article > div.container > div > div > section.m-b-50.p-t-10.row > div.col-md-8.col-lg-9 > table > tbody > tr:nth-child(${i}) > td:nth-child(6)`
            let goalsDifferenceSelector = `#menu-panel > article > div.container > div > div > section.m-b-50.p-t-10.row > div.col-md-8.col-lg-9 > table > tbody > tr:nth-child(${i}) > td:nth-child(9)`

            table.push({
                "name":$(teamNameSelector).text(),
                "points":$(teamPointsSelector).text(),
                "matches":$(teamMatchesSelector).text(),
                "matchesWon":$(matchesWonSelector).text(),
                "matchesTied":$(matchesTiedSelector).text(),
                "matchesLost":$(matchesLostSelector).text(),
                "goalsDifference":$(goalsDifferenceSelector).text()
            })
        }

        return table
    }

    async fetchTopScorers(division) {
        let topScorers = []
        let url 
        switch (division) {
            case "A": url = "https://www.cbf.com.br/futebol-brasileiro/competicoes/campeonato-brasileiro-serie-a"; break
            case "B": url = "https://www.cbf.com.br/futebol-brasileiro/competicoes/campeonato-brasileiro-serie-b"; break
            // Séries C e D são realizadas em outro formato - Não há tabela de pontos corridos como na primeira e na segunda divisão.
        }
        
        let request = await axios.get(url, {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36"})
        let body = request.data
        let $ = cheerio.load(body)

        // TOP 5 ARTILHEIROS
        for (let i = 1; i < 6; i++) {
            let goalsQuantitySelector = `#menu-panel > article > section.m-t-40.p-t-50.p-b-40.bg-lightgray > div > div > div > table > tbody > tr:nth-child(${i}) > th`
            let scorerNameSelector = `#menu-panel > article > section.m-t-40.p-t-50.p-b-40.bg-lightgray > div > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(4) > a`
            let scorerTeamSelector = `#menu-panel > article > section.m-t-40.p-t-50.p-b-40.bg-lightgray > div > div > div > table > tbody > tr:nth-child(${i}) > td.text-center > img`
            let scorerPageSelector = `#menu-panel > article > section.m-t-40.p-t-50.p-b-40.bg-lightgray > div > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(3) > a`

            topScorers.push({ name: $(scorerNameSelector).text(), goals: $(goalsQuantitySelector).text(), team: $(scorerTeamSelector).attr("title"), webpage: $(scorerPageSelector).attr("href")})
        }

        return topScorers
    }

}

module.exports = Brasileirao