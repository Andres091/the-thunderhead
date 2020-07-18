const Discord = require("discord.js");
const fs = require("graceful-fs");

module.exports.run = async (client, message, args) => {
  
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return;
    const deleteCount = parseInt(args[0], 10);
    if (!deleteCount || deleteCount < 2 || deleteCount > 100) return message.channel.send(client.msg["purge_invalid"]);
    message.channel.bulkDelete(deleteCount).catch(error => message.channel.send(client.msg["purge_rejected"] + error));
  
} 

module.exports.config = {
  name: "purge",
  aliases: [],
  use: "purge [Amount]",
  description: "Mass delete messages",
  state : "gamma",
  page: 4
};
