const Discord = require("discord.js");
const fs = require("graceful-fs");
const catFacts = require('cat-facts');
var cats = require("cat-ascii-faces");

module.exports.run = async (client, message, args) => {
  
      let catEmbed = new Discord.MessageEmbed()
        .setColor(client.colors["discord"])
        .setTitle(catFacts.random())
        .setDescription(cats())
        .setImage(`http://www.randomkittengenerator.com/cats/rotator.php`)

    message.channel.send(catEmbed);
  
} 

module.exports.config = {
  name: "cat",
  aliases: [],
  use: "cat",
  description: "Cat facts!",
  state : "gamma",
  page: -1
};
