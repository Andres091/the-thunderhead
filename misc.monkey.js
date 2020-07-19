const Discord = require("discord.js");
const fs = require("graceful-fs");

module.exports.run = async (client, message, args) => {
  
  var Monkeys = ["🐵","🐒","🦧","🐵 🐒 🦧","🙈","🙊","🙉","🙈🙊🙉"];
    message.channel.send(Monkeys[Math.floor(Math.random() * 8)])
  
} 

module.exports.config = {
  name: "monkey",
  aliases: [],
  use: "monkey",
  description: "Temporary command to test if the bot is up!",
  state : "gamma",
  page: -1
};
