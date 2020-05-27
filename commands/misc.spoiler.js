const Discord = require("discord.js");
const fs = require("graceful-fs");

module.exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(client.msg["rejected_client_permission_MANAGE_MESSAGES"]);
  if (!args[1]) return;
  
  for (var tagCheck in args) args[tagCheck] = args[tagCheck].replace(/||/g, '');

  if (args[0] === "the") args = args.shift();
  let book = args[0].toLowerCase().replace("scythe", "0").replace("thunderhead", "1").replace("toll", "2");
  try {
    let book = parseInt(book);
  } catch (err) {
    book = 3;
  }

  const sayMessage = args.shift().join(" ");
  message.delete().catch(O_o => { }); // O_o - he vibes
  message.channel.send(book + " " +sayMessage)
  
} 

module.exports.config = {
  name: "spoilers",
  aliases: ["spoiler", "spoil"],
  use: "spoilers [Book] Spoiler",
  description: "Mark a spoiler",
  state : "beta",
  page: 1
};