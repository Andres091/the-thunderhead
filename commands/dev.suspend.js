const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require('discord-economy');
const config = require("../static/config.json"); 

function clean(text) {
    if (typeof text === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else return text;
}

module.exports.run = async (client, message, args) => {
  if (config.sudo.indexOf(message.author.id) < 0) return; // Dev Only
      
  client.suspend = true;
  message.channel.send(client.msg["suspend"])
  
} 

module.exports.config = {
  name: `${config["developer_prepended_prefix"]}suspend`,
  aliases: [],
  use: `${config["developer_prepended_prefix"]}suspend`,
  description: "Suspend the bot.",
  state : "delta",
  page: 0
};