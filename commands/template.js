const Discord = require("discord.js");
const fs = require("graceful-fs");

// This is a command template. I hope its self documenting so you don't have to sift through my god-awful code! ^.^

module.exports.run = async (client, message, args  ) => {
  
  message.channel.send(`Bot is up! ${client.emotes["emoji_bonk"]}`);
  
} 

module.exports.config = {
  name: "template",
  aliases: [],
  use: "test",
  description: "Temporary command to test if the bot is up!",
  state : "gamma",
  page: -1
};