const Discord = require("discord.js");
const fs = require("graceful-fs");

module.exports.run = async (client, message, args  ) => {
  message.channel.send(client.website);
} 

module.exports.config = {
  name: "site",
  aliases: [],
  use: "site",
  description: "My website!",
  state : "gamma",
  page: 1
};