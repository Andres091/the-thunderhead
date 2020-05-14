const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require('discord-economy');
const config = require("../static/config.json"); 

module.exports.run = async (client, message, args) => {
  if (config.sudo.indexOf(message.author.id) < 0) return; // Dev Only
      
  var recipient = message.mentions.members.first();
  if (!recipient) return message.reply("Please provide a vaild Mention.");
  var amountRecieved = parseInt(args[1], 10);
  if (!amountRecieved) return message.channel.send(message.author.username + " Please provide an amount to give.");
  let output = await eco.AddToBalance(recipient.id, amountRecieved);
  var fundEmbed = new Discord.MessageEmbed()
  .setTitle(`**Balance: **${output.newbalance}`)
  .setFooter(`Thunderhead Banking. ${message.mentions.users.first().username}'s account was funded.`, message.mentions.users.first().avatarURL())
  .setColor(client.colors["discord"]);
  message.channel.send(fundEmbed);
  
} 

module.exports.config = {
  name: `${config["developer_prepended_prefix"]}give`,
  aliases: [`${config["developer_prepended_prefix"]}fund`],
  use: `${config["developer_prepended_prefix"]}give [@User] [Amount]`,
  description: "Give a user currency.",
  state : "delta",
  page: 0
};