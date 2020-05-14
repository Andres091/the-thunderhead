const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require('discord-economy');
const config = require("../static/config.json"); 

module.exports.run = async (client, message, args  ) => {
  
 var output = await eco.FetchBalance(message.author.id)
        var balance = output.balance;
        if (!args[0]) return message.channel.send(client.msg["roll_undefined"]);
        var stake = args[0];
        if (isNaN(stake)) return message.channel.send(client.msg["roll_nan"]);
        if (stake < 1 || stake > balance) return message.channel.send(client.msg["roll_invalid"]);
        var staticStake = stake;
        var profitFactor = Math.floor((Math.random() * 6) + 1) - 4;
        var profitWord = "/";
        var gambleEndColor = client.colors["gamble_even"];
        if (0 < profitFactor) {
            // positive value
            profitWord = "+";
            stake = stake * profitFactor;
            gambleEndColor = client.colors["gamble_green"];
        } else if (profitFactor < 0) {
            // negative value
            profitWord = "-";
            stake = stake * -1;
            gambleEndColor = client.colors["gamble_red"];
        } else {
            stake = 0;
        }
        var rollEmbed = new Discord.MessageEmbed()
          .setTitle(message.author.username)
          .addField(`${profitWord} ${Math.abs(stake)} ${client.emotes["currency_vibes"]}`, `Balance: **${parseInt(balance) + parseInt(stake)}**`)
          .setFooter(`${message.author.username}'s account.`, message.author.avatarURL({dynamic: true}))
          .setColor(gambleEndColor);
        message.channel.send(rollEmbed)



        const channel = client.channels.cache.get(config["econ_log_id"]);
        if (message.guild.id != "625021277295345667") channel.send(rollEmbed)
        output = await eco.AddToBalance(message.author.id, stake)
  
} 

module.exports.config = {
  name: "roll",
  aliases: ["gamble", "slots"],
  use: "roll [Amount]",
  description: "Gamble money. Although I suggest you refrain from using it often; I cannot stop you.",
  state : "gamma",
  page: 2
};