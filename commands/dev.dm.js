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
      
 var messageValue = args.slice(1).join(" ");
    var target = args[0].replace(/[@!<>]/g, "");
    try {
        client.users.cache.get(target).send(messageValue).catch(console.error);
    } catch (err) {
        message.channel.send(`\`\`\`diff\n-ERROR\`\`\`\`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  
} 

module.exports.config = {
  name: `${config["developer_prepended_prefix"]}dm`,
  aliases: [],
  use: `${config["developer_prepended_prefix"]}dm [@User] [Message]`,
  description: "DM a user via the bot.",
  state : "delta",
  page: 0
};