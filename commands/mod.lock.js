const Discord = require("discord.js");
const fs = require("graceful-fs");


module.exports.run = async (client, message, args) => {
  let requiredPermission = "MANAGE_CHANNELS"; 
  if (!message.member.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_user_permission_"+requiredPermission]);
  if (!message.guild.me.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_client_permission_"+requiredPermission]);
   

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