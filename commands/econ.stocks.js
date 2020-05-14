const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require('discord-economy');
const alpha = require('alphavantage')({ key: `cirrus-${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}` });
const config = require("../static/config.json"); 
const shares = require("../dynamic/shares.json");
module.exports.run = async (client, message, args) => {
   
  try {
        let index = 0;
        var target;
        if (args[0]) target = client.users.get(args[0].replace(/[@!<>]/g, ""));
        if (!target) target = message.author;
        if (args[0]) args[0] = args[0].toUpperCase()
        if (!shares[message.author.id]) shares[message.author.id] = {}
        if (target && (!config.stocks[args[0]])) {
            let stockMessage = `**${target.username}'s Portfolio**`;
            for (var i in config.stocks) {
                let sharesOf = 0;
                if (shares[target.id][Object.keys(config.stocks)[index]]) sharesOf = shares[target.id][Object.keys(config.stocks)[index]];
                stockMessage += `\n${config.stocks[i][0]}: ${Object.keys(config.stocks)[index]} | Owned: ${sharesOf} shares`;
                index++
            }
            message.channel.send(stockMessage);
        } else {
            if (!config.stocks[args[0]]) return message.channel.send(client.msg["stocks_undefined"]);
            alpha.data.intraday(config.stocks[args[0]][1]).then(data => { // [1] because thats the name of the irl company its mirroring :0
                let stockPrice = (parseInt(data["Time Series (1min)"][Object.keys(data["Time Series (1min)"])[0]]["4. close"]));
                let oldPrice = (parseInt(data["Time Series (1min)"][Object.keys(data["Time Series (1min)"])[1]]["4. close"]));
                message.channel.send(`${config.stocks[args[0]][0]} (${args[0]}) @ ${stockPrice} ${client.emotes["currency_vibes"]}`);
            });
        }
    } catch (err) { console.log(err);};
    
  
} 

module.exports.config = {
  name: "stocks",
  aliases: ["shares", "stonks"],
  use: "stocks [Company]",
  description: "See a companies stocks, or view traded companies.",
  state : "gamma",
  page: 2
};