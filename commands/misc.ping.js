const Discord = require("discord.js");
const fs = require("graceful-fs");

module.exports.run = async (client, message, args) => {
  const m = await message.channel.send(client.msg["ping_pending"]);
  m.edit(client.msg["ping_resolved"]);
} 

module.exports.config = {
  name: "ping",
  aliases: [],
  use: "ping",
  description: "Pong! 🏓",
  state : "gamma",
  page: 1
};