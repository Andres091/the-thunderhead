const Discord = require("discord.js");
const fs = require("graceful-fs");

// Suggestion; make a github account!

module.exports.run = async (client, message, args  ) => {
  
  message.channel.send(`__Suggest a Feature Here:__\nhttps://github.com/login?return_to=https%3A%2F%2Fgithub.com%2Fhumboldt123%2Fthe-thunderhead%2Fissues%2Fnew%3Fassignees%3Dhumboldt123%26labels%3Denhancement%26template%3Dfeature_request.md%26title%3D%255BFEATURE%2BREQUEST%255D`);
  
} 

module.exports.config = {
  name: "suggest",
  aliases: [],
  use: "request",
  description: "Suggest a feature for the bot.",
  state : "gamma",
  page: 1
};