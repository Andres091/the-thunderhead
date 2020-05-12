const Discord = require("discord.js");
const fs = require("graceful-fs");
module.exports.run = async (client, message, args  ) => {
  
  message.channel.send(`${message.author.id} has asserted their dominance! ${client.emotes["emoji_bonk"]}`);
  
} 

module.exports.config = {
  name: "tpose",
  aliases: [],
  use: "tpose",
  description: "T-Pose command as requested by <@!678826611910377494>",
  state : "gamma",
  page: -1
};