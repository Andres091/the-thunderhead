const Discord = require("discord.js");
const fs = require("graceful-fs");


module.exports.run = async (client, message, args) => {

    if (!message.member.hasPermission("MANAGE_CHANNELS")) return;
    message.channel.createOverwrite(message.guild.roles.everyone, {
        SEND_MESSAGES: true
    }).then(updated => console.log(updated.permissionOverwrites.get(message.author.id)));
    message.channel.send(client.msg["unlock"])
} 

module.exports.config = {
  name: "unlock",
  aliases: [],
  use: "unlock",
  description: "Unlock the current channel",
  state : "gamma",
  page: 4
};