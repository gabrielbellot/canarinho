const { Message } = require("discord.js")

const { URL } = require("url")

class Extensions {

	constructor (client) {
		this.client = client
	}

	loadExtensions() {
		Message.prototype.reply = function (options = {}) {
			return this.channel.send(this.author, options)
		}

		Message.prototype.reply = function (msg) {
			return this.channel.send(`${this.author} ${msg}`)
		}

		Message.prototype.reply = function (msg, options = {}) {
			return this.channel.send(`${this.author} ${msg}`, options)
		}

		Object.prototype.isEmpty = function() {
			for(const key in this) {
				if(this.hasOwnProperty(key))
					return false
			}
			return true
		}

		String.prototype.removeCodeMarks = function() {
			return this.replace("`", "")
		}

		String.prototype.isValidUrl = function() {
			try {
				new URL(this)

				return true
			} catch (e) {
				return false
			}
		}

		Array.prototype.random = function() {
			return this[Math.floor(Math.random() * this.length)] 
		}
	}

}

module.exports = Extensions