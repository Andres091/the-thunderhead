const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require('discord-economy');
const alpha = require('alphavantage')({ key: `cirrus-${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}` });
const config = require("../static/config.json"); 
module.exports.run = async (client, message, args) => {
   
    if (!client.shares.get(message.author.id)) client.shares.set(message.author.id, {});
    if (!args[0]) return message.channel.send(client.msg["invest_undefined"]);
    if (args[1] < 1) return message.channel.send(client.msg["invest_invalid"]);
    if (!args[1] || Math.floor(args[1]) != args[1]) return message.channel.send(client.msg["invest_invalid"]);
    if (!config.stocks[args[0].toUpperCase()]) return message.channel.send(client.msg["invest_invalid"]);
    var output = await eco.FetchBalance(message.author.id)
    alpha.data.intraday(config.stocks[args[0].toUpperCase()][1]).then(data => {
        let stockPrice = (parseInt(data["Time Series (1min)"][Object.keys(data["Time Series (1min)"])[0]]["4. close"]));
        if (output.balance < stockPrice * parseInt(args[1])) return message.channel.send(client.msg["invest_amount_invalid"]);
        if (!client.shares.get(message.author.id, args[0].toUpperCase())) client.shares.set(message.author.id, 0, args[0].toUpperCase());
        client.shares.set(message.author.id, parseInt(args[1]) + (client.shares.get(message.author.id, args[0].toUpperCase())), args[0].toUpperCase()); 
        eco.AddToBalance(message.author.id, stockPrice * args[1] * -1)
        
        
        message.channel.send(client.msg["invest_success"].replace("[COST]", stockPrice*args[1]).replace("[CURRENCY]", client.emotes["currency_vibes"]).replace("[AMOUNT]",client.shares.get(message.author.id)[args[0].toUpperCase()]).replace("[STOCK]", args[0].toUpperCase()))  //whoops!
        
        const channel = client.channels.cache.get(config["econ_log_id"]);
        if (message.guild.id != "625021277295345667") channel.send(`${message.author.username} (${message.author.id})  purchased shares for ${stockPrice * args[1]} ${client.emotes["currency_vibes"]}. they now have ${client.shares.get(message.author.id)[args[0].toUpperCase()]} shares in ${args[0].toUpperCase()}.`)
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