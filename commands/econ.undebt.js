const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require('discord-economy');
const config = require("../static/config.json");
module.exports.run = async (client, message, args  ) => {
  
    var currencyCount = await eco.FetchBalance(message.author.id)
    currencyCount = currencyCount.balance
    if (currencyCount < 0) {
        await eco.AddToBalance(message.author.id, (currencyCount * -1))
        message.channel.send(client.msg["undebt_success"])

    } else message.channel.send(client.msg["undebt_failure"]);



    const channel = client.channels.cache.get(config["econ_log_id"]);
    if (message.guild.id != "625021277295345667") channel.send(`${message.author.username} reset their balance.`)
  
} 

module.exports.config = {
  name: "undebt",
  aliases: [],
  use: "undebt",
  description: "Clear your balance if it is less than zero.",
  state : "gamma",
  page: 2
};