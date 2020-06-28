const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require('discord-economy');
var eco = require('discord-economy');

module.exports.run = async (client, message, args  ) => {
    if (!client.vault[message.author.id]) return message.channel.send(client.msg["reap_undefined"]);
    if (client.vault[message.author.id].amount == 0) return message.channel.send(client.msg["reap_failure"]);
    var cost = client.vault[message.author.id].amount;
    client.vault[message.author.id].amount = 0;
    await eco.AddToBalance(message.author.id, cost);
    message.channel.send(`${client.msg["reap_success"]} ${cost} ${client.emotes["currency_vibes"]}.`);
} 

module.exports.config = {
  name: "reap",
  aliases: [],
  use: "reap",
  description: "Collect profit on things you have sold.",
  state : "gamma",
  page: 2
};
