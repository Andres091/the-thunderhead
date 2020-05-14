const Discord = require("discord.js");
const fs = require("graceful-fs");


module.exports.run = async (client, message, args) => {
    if (!message.member.hasPermission("BAN_MEMBERS")) return;
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.reply(client.msg["ban_invalid"]);
    if (!member.bannable) return message.reply(client.msg["ban_rejected"]);
    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No Reason Provided";
    await member.ban(reason).catch(error => message.reply(error));
    let banEmbed = new Discord.MessageEmbed()
      .setTitle("User Banned")
      .setDescription(`${member.user.tag} has been banned by ${message.author.tag}`)
      .addField("Reason", reason)
      .setColor(client.colors["discord"]);
    message.channel.send(banEmbed);
} 

module.exports.config = {
  name: "ban",
  aliases: [],
  use: "ban [@User]",
  description: "Ban a user from the server",
  state : "gamma",
  page: 4
};