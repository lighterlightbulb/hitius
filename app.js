"use strict"

require("dotenv").config()
const discord = require("discord.js")
const client = new discord.Client()
const keywords = (process.env.KEYWORDS).split(",")
const matchers = (process.env.MATCHERS).split(",")
const blabs = (process.env.BLABS).split(",")
var channel = null

function should() { return Math.floor(Math.random() * 10) > 5 }

function garble(text) {
    let characters = text.split("") // Split
    let indices = []

    // Populate indices to garble
    for (let i = 0; i < characters.length; i++) {
        if (should()) { indices.push(i) }
    }

    // Garble
    for (let i = 0; i < indices.length; i++)
    {
        if (should()) {
            characters[indices[i]] = "" /// empty
        } else {
            characters.splice[indices[i], 0, characters[indices[i]]]
        }
    }

    // Give back
    return characters.join("")
}

client.on("message", (message) => {
    if (message.author.id == client.user.id) { return } // Skip if this is us
    if (channel == null) { channel = message.channel } // Set the current channel if it hasn't been set

    let content = message.content.split(" ")
    let indice = -1

    for (let i = 0; i < content.length; i++) {
        let word = content[i].toLowerCase()
        if (matchers.includes(word)) {
            indice = i
        }
    }

    if (indice == -1 || (content[indice + 1] == null)) { return } // Skip if we didn't manage to find anything or if nothing trailing

    // Replace everything after that index with one keyword
    let caps = should()
    let keyword = keywords[Math.floor(Math.random() * keywords.length)]
    
    if (caps) { keyword = keyword.toUpperCase() }

    for (let i = (indice + 1); i < content.length; i++) {
        if (should()) { content[i] = garble(keyword) } else { content[i] = keyword }
    }

    // Reply now
    message.channel.send(content.join(" "))
})

setInterval(() => { if (channel != null) { channel.send(blabs[Math.floor(Math.random() * blabs.length)]) } }, process.env.BLAB_INTERVAL)

client.on("ready", () => { console.log(`Logged in as ${client.user.tag}`) })
client.login(process.env.TOKEN)