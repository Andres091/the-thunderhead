const Discord = require("discord.js");
const fs = require("graceful-fs");
const catFacts = require('cat-facts');
var cats = require("cat-ascii-faces");

module.exports.run = async (client, message, args) => {
  
  message.channel.send(cats() + "\n" + catFacts.random());
  
} 

module.exports.config = {
  name: "cat",
  aliases: [],
  use: "cat",
  description: "Cat facts!",
  state : "gamma",
  page: -1
};