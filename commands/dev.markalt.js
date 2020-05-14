const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require('discord-economy');
const config = require("../static/config.json"); 
const altlist = require("../dynamic/altlist.json"); 

module.exports.run = async (client, message, args) => {
  if (config.sudo.indexOf(message.author.id) < 0) return; // Dev Only
    if (!args[0]) return;
    altlist.alts.push(args[0])
    let user = client.users.cache.get(args[0])
    message.channel.send(`${user.username} of (${user.id}) was marked as an alt to farm vibes.`)
  
} 

module.exports.config = {
  name: `${config["developer_prepended_prefix"]}altlist`,
  aliases: [],
  use: `${config["developer_prepended_prefix"]}altlist [@User]`,
  description: "Mark a user as an alt.",
  state : "delta",
  page: 0
};