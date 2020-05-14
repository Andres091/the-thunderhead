const Discord = require("discord.js");
const fs = require("graceful-fs");

// This is a command template. I hope its self documenting so you don't have to sift through my god-awful code! ^.^

module.exports.run = async (client, message, args) => {

  if (!message.member.hasPermission("MANAGE_MESSAGES")) return;
  const sayMessage = args.join(" ");
  message.delete().catch(O_o => { }); // O_o - Cut him some slack, he just woke up!
  message.channel.send(sayMessage);

} 

module.exports.config = {
  name: "say",
  aliases: [],
  use: "say [Message]",
  description: "Say something via the bot!",
  state : "gamma",
  page: 4
};