const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require('discord-economy');
const config = require("../static/config.json");
const items = require("../dynamic/items.json");
const vault = require("../dynamic/vault.json");
var eco = require('discord-economy');

module.exports.run = async (client, message, args) => {
  let requiredPermission = "USE_EXTERNAL_EMOJIS"; 
  if (!message.member.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_user_permission_"+requiredPermission]);
  if (!message.guild.me.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_client_permission_"+requiredPermission]);

  
  var toBuy = args[0];
  if (!items["marketplace"][toBuy]) return message.channel.send(client.msg["buy_undefined"]);
  var item = items["marketplace"][toBuy];
  var cost = item.cost;
  var vendor = item.sellerid;
  var itemName = item.name;
  var balance = await eco.FetchBalance(message.author.id);
  if (balance.balance < cost) return message.channel.send(`${client.msg["buy_amount_invalid"]} ${(cost - balance.balance)} more ${client.emotes["currency_vibes"]}.`);
  await eco.AddToBalance(message.author.id, cost * -1);
  if (!items[message.author.id]) items[message.author.id] = {};
  items[message.author.id][toBuy] = (items["marketplace"][toBuy]);
  if (!vault[vendor]) vault[vendor] = {
          amount: cost
  }; else vault[vendor].amount = (parseInt(vault[vendor].amount) + parseInt(cost));

  delete items["marketplace"][toBuy];
  item.ownerid = message.author.id;
  message.channel.send(`You bought ${itemName} for ${cost} ${client.emotes["currency_vibes"]}.`);
  const channel = client.channels.get(config["econ_log_id"]);
  if (message.guild.id != "625021277295345667") channel.send(`${message.author.username} bought ${itemName} for ${cost} ${client.emotes["currency_vibes"]} from (${vendor}).`);
  
} 

module.exports.config = {
  name: "sell",
  aliases: [],
  use: "sell [Item]",
  description: "Sell an item to the marketplace",
  state : "gamma",
  page: 2
};