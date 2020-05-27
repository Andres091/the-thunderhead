const Discord = require("discord.js");
const fs = require("graceful-fs");

module.exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(client.msg["rejected_client_permission_MANAGE_MESSAGES"]);
  if (!args[1]) return;
  
  for (var tagCheck in args) args[tagCheck] = args[tagCheck].replace(/||/g, '');

  if (args[0] === "the") args.shift();
  let book = args[0].toLowerCase().replace("scythe", "0").replace("thunderhead", "1").replace("toll", "2");
  try {
    book = parseInt(book);
    if (isNaN(book)) book = 3;
  } catch (err) {
    book = 3;
  }
  
  args.shift();
  const sayMessage = args.join(" ");
  message.delete().catch(O_o => { }); // O_o - he vibes
  
  let spoilerKey = {
    0: {"emoji":client.emotes["utility_scythe"],"name":"for Scythe"},
    1: {"emoji":client.emotes["utility_thunderhead"],"name":"for Thunderhead"},
    2: {"emoji":client.emotes["utility_toll"],"name":"for The Toll"},
    3: {"emoji":"📑","name":""}
  }
  
  //📚 Spoilers!
  let spoilerEmbed = new Discord.MessageEmbed()
  .setTitle(`Spoilers ${spoilerKey[book].name} 📚${spoilerKey[book].emoji}`)
  message.channel.send(`||${sayMessage}||`)
  
} 

module.exports.config = {
  name: "spoilers",
  aliases: ["spoiler", "spoil"],
  use: "spoilers [Book] Spoiler",
  description: "Mark a spoiler",
  state : "beta",
  page: 1
};