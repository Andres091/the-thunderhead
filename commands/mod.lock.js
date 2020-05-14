const Discord = require("discord.js");
const fs = require("graceful-fs");


module.exports.run = async (client, message, args) => {

    if (!message.member.hasPermission("MANAGE_CHANNELS")) return;
    message.channel.createOverwrite(message.guild.roles.everyone, {
        SEND_MESSAGES: false
    }).then(updated => console.log(updated.permissionOverwrites.get(message.author.id)));
    message.channel.send(client.msg["lock"])
} 

module.exports.config = {
  name: "lock",
  aliases: [],
  use: "lock",
  description: "Lock the current channel",
  state : "gamma",
  page: 4
};