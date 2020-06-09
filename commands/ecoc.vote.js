const Discord = require("discord.js");
const fs = require("graceful-fs");

// This is a command template. I hope its self documenting so you don't have to sift through my god-awful code! ^.^

module.exports.run = async (client, message, args  ) => {
  
  message.channel.send(`Vote Here: https://top.gg/bot/629799045954797609/vote`);
  
} 

module.exports.config = {
  name: "vote",
  aliases: [],
  use: "vote",
  description: "Go to the vote site!",
  state : "gamma",
  page: -1
};