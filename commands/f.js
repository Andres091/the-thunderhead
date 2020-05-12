const Discord = require("discord.js");
const fs = require("graceful-fs");
module.exports.run = async (client, message, args  ) => {

    var FEmbed = new Discord.MessageEmbed().setColor(client.colors["thunderhead"]).setDescription(`**f**🥀  ${message.author.username} has paid their respects. ${client.emotes["emoji_bigfake"]}`);
    message.channel.send(FEmbed);
  
} 

module.exports.config = {
  name: "f",
  aliases: [],
  use: "f",
  description: "Pay Respects",
  state : "gamma",
  page: -1
};