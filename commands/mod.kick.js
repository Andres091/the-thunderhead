const Discord = require("discord.js");
const fs = require("graceful-fs");


module.exports.run = async (client, message, args) => {
  let requiredPermission = "KICK_MEMBERS"; 
  if (!message.member.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_user_permission_"+requiredPermission]);
  if (!message.guild.me.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_client_permission_"+requiredPermission]);
     //Uses new perm system
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if (!member) return message.channel.send(client.msg["kick_invalid"]);
    if (!member.kickable) return message.channel.send(client.msg["kick_rejected"]);
    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No Reason Provided";
    await member.kick(reason).catch(error => message.channel.send(error));
    let kickEmbed = new Discord.MessageEmbed()
      .setTitle("User Kicked")
      .setDescription(`${member.user.tag} has been kicked by ${message.author.tag}`)
      .addField("Reason", reason)
      .setColor(client.colors["discord"]);
    message.channel.send(kickEmbed);
} 

module.exports.config = {
  name: "kick",
  aliases: [],
  use: "kick [@User]",
  description: "Kick a user from the server",
  state : "gamma",
  page: 4
};
