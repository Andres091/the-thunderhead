const Discord = require("discord.js");
const fs = require("graceful-fs");

module.exports.run = async (client, message, args) => {

  message.delete();
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return;
  var title = args[0];
  var content = args.slice(1).join(" ");
  
  let announceEmbed = new Discord.MessageEmbed()
    .setColor(client.colors["discord"])
    .setTitle(title)
    .setDescription(content)
    .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}));
  message.channel.send(announceEmbed);  
} 

module.exports.config = {
  name: "announce",
  aliases: ["announce [Title] [Announcement]"],
  use: "test",
  description: "Make an announcement",
  state : "gamma",
  page: 4
};