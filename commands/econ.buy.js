const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require('discord-economy');
const config = require("../static/config.json");
var eco = require('discord-economy');

module.exports.run = async (client, message, args) => {
  let requiredPermission = "USE_EXTERNAL_EMOJIS"; 
  if (!message.member.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_user_permission_"+requiredPermission]);
  if (!message.guild.me.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_client_permission_"+requiredPermission]);

  
  var toBuy = args[0];
  if (!client.items.get("marketplace")[toBuy]) return message.channel.send(client.msg["buy_undefined"]);
  var item = client.items.get("marketplace")[toBuy];
  var cost = item.cost;
  var vendor = item.sellerid;
  var itemName = item.name;
  var balance = await eco.FetchBalance(message.author.id);
  if (balance.balance < cost) return message.channel.send(`${client.msg["buy_amount_invalid"]} ${(cost - balance.balance)} more ${client.emotes["currency_vibes"]}.`);
  await eco.AddToBalance(message.author.id, cost * -1);
  if (!client.items.get(message.author.id)) client.items.set(message.author.id, {});
  client.items.set(message.author.id, (client.items.get("marketplace")[toBuy]), toBuy);
  if (!client.vault[vendor]) client.vault[vendor] = {
          amount: cost
  }; else client.vault[vendor].amount = (parseInt(client.vault[vendor].amount) + parseInt(cost));

  client.items.delete("marketplace", toBuy)
  item.ownerid = message.author.id;
  message.channel.send(`You bought ${itemName} for ${cost} ${client.emotes["currency_vibes"]}.`);
  const channel = client.channels.cache.get(config["econ_log_id"]);
  if (message.guild.id != "625021277295345667") channel.send(`${message.author.username} bought ${itemName} for ${cost} ${client.emotes["currency_vibes"]} from (${vendor}).`);
  
} 

module.exports.config = {
  name: "buy",
  aliases: [],
  use: "buy [Item]",
  description: "Buy an item from the marketplace",
  state : "gamma",
  page: 2
};