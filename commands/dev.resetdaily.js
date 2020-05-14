const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require('discord-economy');
const config = require("../static/config.json"); 

module.exports.run = async (client, message, args) => {
  if (config.sudo.indexOf(message.author.id) < 0) return; // Dev Only
      
    args[0] = args[0].replace(/[@!<>]/g, "");
    var output = await eco.ResetDaily(args[0])
    message.channel.send("<@!" + args[0] + "> had their " + output) //It will send 'Daily Reset.'
  
} 

module.exports.config = {
  name: `${config["developer_prepended_prefix"]}resetdaily`,
  aliases: [],
  use: `${config["developer_prepended_prefix"]}resetdaily [@User]`,
  description: "Reset a users daily.",
  state : "delta",
  page: 0
};