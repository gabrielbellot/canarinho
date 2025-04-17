const axios = require('axios')
const NodeCache = require('node-cache')

const cache = new NodeCache({ stdTTL: 600 })

const API_KEY = 'cc65091c4ca843f79ebc6385d7411d89'
const BASE_URL = 'https://api.football-data.org/v4'

class Brasileirao {

    // Função para buscar o ID da competição
    async getCompetitionId(division) {
        try {
            const response = await axios.get(`${BASE_URL}/competitions`, {
                headers: { 'X-Auth-Token': API_KEY }
            })

            // Encontre a competição correta apenas para a Série A
            const competition = response.data.competitions.find(comp => comp.name.includes('Campeonato Brasileiro') && comp.name.includes('Série A'))

            return competition ? competition.id : null
        } catch (error) {
            console.error('Erro ao buscar competição:', error.message)
            return null
        }
    }

    // Função para buscar a tabela de classificação
    async fetchTable(division) {
        if (division !== 'A') return []  // Removendo a Série B

        const competitionId = await this.getCompetitionId(division)
        if (!competitionId) return []

        const cacheKey = `table-${division}`
        const cachedData = cache.get(cacheKey)
        if (cachedData) return cachedData

        const url = `${BASE_URL}/competitions/${competitionId}/standings`
        console.log(url)

        try {
            const response = await axios.get(url, {
                headers: { 'X-Auth-Token': API_KEY }
            })

            const table = response.data.standings[0].table.map((team, idx) => ({
                name: team.team.name,
                points: team.points,
                matches: team.playedGames,
                matchesWon: team.won,
                matchesTied: team.draw,
                matchesLost: team.lost,
                goalsDifference: team.goalDifference
            }))

            cache.set(cacheKey, table)
            return table
        } catch (error) {
            console.error(`Erro ao buscar tabela da Série ${division}:`, error.message)
            return []
        }
    }

    // Função para buscar os artilheiros
    async fetchTopScorers(division) {
        if (division !== 'A') return []  // Removendo a Série B

        const competitionId = await this.getCompetitionId(division)
        if (!competitionId) return []

        const cacheKey = `scorers-${division}`
        const cachedData = cache.get(cacheKey)
        if (cachedData) return cachedData

        const url = `${BASE_URL}/competitions/${competitionId}/scorers`

        try {
            const response = await axios.get(url, {
                headers: { 'X-Auth-Token': API_KEY }
            })

            const topScorers = response.data.scorers.slice(0, 5).map(scorer => ({
                name: scorer.player.name,
                goals: scorer.goals,
                team: scorer.team.name,
                webpage: scorer.player.id // Supondo que tenha o ID do jogador
            }))

            cache.set(cacheKey, topScorers)
            return topScorers
        } catch (error) {
            console.error(`Erro ao buscar artilheiros da Série ${division}:`, error.message)
            return []
        }
    }
}

module.exports = Brasileirao
