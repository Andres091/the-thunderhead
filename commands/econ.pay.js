const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require('discord-economy');
const config = require("../static/config.json"); 

module.exports.run = async (client, message, args) => {
  
  // Of all commands, the code for this is the cleanest. I like it.
  
  var output = await eco.FetchBalance(message.author.id);
  var user = message.mentions.users.first();
  var amount = args[1];
  if (!user) return message.reply(client.msg["pay_user_undefined"]);
  if (!amount) return message.reply(client.msg["pay_amount_undefined"]);
  var output = await eco.FetchBalance(message.author.id);
  if (output.balance < amount) return message.channel.send(client.msg["pay_amount_invalid"])
  if (isNaN(amount) || amount != Math.floor(amount)) return message.reply(client.msg["pay_amount_nan"]);
  if (amount < 0) return message.channel.send(client.msg["pay_amount_negative"]);
  if (amount == 0) return message.channel.send(client.msg["pay_amount_zero"]);
  if (user.id === message.author.id) return message.channel.send(client.msg["pay_user_invalid"]);
  let transfer = await eco.Transfer(message.author.id, user.id, amount);
  let balText = client.msg["pay_success"].replace("[USER]", user.username).replace("[AMOUNT]", amount).replace("[CURRENCY]", client.emotes["currency_vibes"]).replace("[AUTHOR]", message.author.username);
  var payEmbed = new Discord.MessageEmbed()
    .addField(user.username, balText)
    .setColor(client.colors["gamble_green"]);
  message.channel.send(payEmbed);


  const channel = client.channels.cache.get(config["econ_log_id"]);
  if (message.guild.id != "625021277295345667") channel.send(payEmbed)
  
} 

module.exports.config = {
  name: "pay",
  aliases: ["give", "fund"],
  use: "pay [@User] [Amount]",
  description: "Do a good deed and give to another user.",
  state : "gamma",
  page: 2
};