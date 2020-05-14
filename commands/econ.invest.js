const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require('discord-economy');
const alpha = require('alphavantage')({ key: `cirrus-${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}` });
const config = require("../static/config.json"); 
const shares = require("../dynamic/shares.json");
module.exports.run = async (client, message, args) => {
   
     if (!shares[message.author.id]) shares[message.author.id] = {};
    if (!args[0]) return message.channel.send(client.msg["invest_undefined"]);
    if (args[1] < 1) return message.channel.send(client.msg["invest_invalid"]);
    if (!args[1] || Math.floor(args[1]) != args[1]) return message.channel.send(client.msg["invest_invalid"]);
    if (!config.stocks[args[0].toUpperCase()]) return message.channel.send(client.msg["invest_invalid"]);
    var output = await eco.FetchBalance(message.author.id)
    alpha.data.intraday(config.stocks[args[0].toUpperCase()][1]).then(data => {
        let stockPrice = (parseInt(data["Time Series (1min)"][Object.keys(data["Time Series (1min)"])[0]]["4. close"]));
        if (output.balance < stockPrice * parseInt(args[1])) return message.channel.send(client.msg["invest_amount_invalid"]);
        if (!shares[message.author.id][args[0].toUpperCase()]) shares[message.author.id][args[0].toUpperCase()] = 0;
        shares[message.author.id][args[0].toUpperCase()] += parseInt(args[1])
        eco.AddToBalance(message.author.id, stockPrice * args[1] * -1)
        message.channel.send(`Shares purchased for ${stockPrice * args[1]} ${client.emotes["currency_vibes"]}. You now have ${shares[message.author.id][args[0].toUpperCase()]} shares in ${args[0].toUpperCase()}.`)
        const channel = client.channels.cache.get(config["econ_log_id"]);
        if (message.guild.id != "625021277295345667") channel.send(`${message.author.username} (${message.author.id})  purchased shares for ${stockPrice * args[1]} ${client.emotes["currency_vibes"]}. they now have ${shares[message.author.id][args[0].toUpperCase()]} shares in ${args[0].toUpperCase()}.`)
    });
    
  
} 

module.exports.config = {
  name: "invest",
  aliases: [],
  use: "invest [Company] [Amount]",
  description: "Invest in a company and hope their stock price goes up.",
  state : "gamma",
  page: 2
};