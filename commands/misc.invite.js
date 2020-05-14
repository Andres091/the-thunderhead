const Discord = require("discord.js");
const fs = require("graceful-fs");

module.exports.run = async (client, message, args) => {  
  let siteEmbed = new Discord.MessageEmbed()
    .setAuthor("Invite Button", "https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2Fa09f5b5e-9054-4afc-8dcc-67ede76ea11c-Thunder.png", `https://discord.com/oauth2/authorize?client_id=${client.id}&scope=bot&permissions=8`)
    .setColor(client.colors["discord"]);
  message.channel.send(siteEmbed);
} 

module.exports.config = {
  name: "invite",
  aliases: [],
  use: "invite",
  description: "My invite!",
  state : "gamma",
  page: -1
};