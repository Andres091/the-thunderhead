const Discord = require("discord.js");
const fs = require("graceful-fs");
const alpha = require('alphavantage')({ key: `cirrus-${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}` });
const config = require("../static/config.json"); 
module.exports.run = async (client, message, args) => {
   
  try {
        let index = 0;
        var target;
        if (args[0]) target = client.users.cache.get(args[0].replace(/[@!<>]/g, ""));
        if (!target) target = message.author;
        if (args[0]) args[0] = args[0].toUpperCase()
        if (!client.shares.get(message.author.id)) client.shares.set(message.author.id, {});
        if (target && (!config.stocks[args[0]])) {
            let stockMessage = `**${target.username}'s Portfolio**`;
            for (var i in config.stocks) {
                let sharesOf = 0;
                if (client.shares.get(target.id)[Object.keys(config.stocks)[index]]) sharesOf = client.shares.get(target.id)[Object.keys(config.stocks)[index]];
                stockMessage += `\n${config.stocks[i][0]}: ${Object.keys(config.stocks)[index]} | Owned: ${sharesOf} shares`;
                index++
            }
            message.channel.send(stockMessage);
        } else {
            if (!config.stocks[args[0]]) return message.channel.send(client.msg["stocks_undefined"]);
            alpha.data.intraday(config.stocks[args[0]][1]).then(data => { // [1] because thats the name of the irl company its mirroring :0
                let stockPrice = (parseInt(data["Time Series (1min)"][Object.keys(data["Time Series (1min)"])[0]]["4. close"]));
                // let oldPrice = (parseInt(data["Time Series (1min)"][Object.keys(data["Time Series (1min)"])[1]]["4. close"])); // todo: maybe add graph or something epic!!111!!!!!!!1!!1!
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