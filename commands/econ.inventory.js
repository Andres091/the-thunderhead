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

  let requiredPermission = "EMBED_LINKS"; 
  if (!message.member.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_user_permission_"+requiredPermission]);
  if (!message.guild.me.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_client_permission_"+requiredPermission]);
  
let requiredPermission = "USE_EXTERNAL_EMOJIS"; 
  if (!message.member.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_user_permission_"+requiredPermission]);
  if (!message.guild.me.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_client_permission_"+requiredPermission]);

  let requiredPermission = "MANAGE_MESSAGES"; 
  if (!message.guild.me.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_client_permission_"+requiredPermission]);

  let requiredPermission = "ADD_REACTIONS"; 
  if (!message.member.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_user_permission_"+requiredPermission]);
  if (!message.guild.me.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_client_permission_"+requiredPermission]);

  
  let user = args[0];
  let cost;  
  if (!user) user = message.author.id;
  user = user.replace(/[@!<>]/g, "");
  if (!message.guild.member(client.user).hasPermission("MANAGE_MESSAGES")) return; //todo: code permdeny system
  if (!message.guild.member(client.user).hasPermission("ADD_REACTIONS")) return;
  if (!items[user]) return message.channel.send(client.msg["inv_undefined"]);
  var embeds = [];
  var myItems = items[user];
  var count = -1;
  for (var item in myItems) {
      count++;
      var footer = item;
      item = myItems[item];
      var title = `${item.name} ${item.emoji}`;
      var description = item.description;
      var image = item.image;
      var type = item.type;
      cost = item.cost
      embeds.push({
          title: title,
          description: description,
          color: 4439665,
          footer: {
              text: `Value: ${cost} || Sell with ${config.prefix}sell ${footer}`
          },
          thumbnail: {
              url: image
          },
          author: {
              name: type,
              icon_url: "https://cdn.glitch.com/a09f5b5e-9054-4afc-8dcc-67ede76ea11c%2FThunder.png?v=1574998975490"
          }
      });
        }
  var username_message = client.users.cache.get(user);
  username_message = username_message.username;
  if (user === "marketplace") username_message = "Marketplace";
  
  message.channel.send("Inventory || " + username_message + ":  " + (count + 1));
  var b = "◀";
  var f = "▶";
  var page = args[1] - 1;
  if (!embeds[page - 1]) page = 0;
  var embed = embeds[page];
  const m = await message.channel.send({
      embed
  });
  m.react(b).then(() => m.react(f));
  const filter = (reaction, user) => {
      return ([b, f].includes(reaction.emoji.name) && user.id === message.author.id);
  };
  m.createReactionCollector(filter, {
      time: 60000,
      errors: ["time"]
  }).on("collect", reaction => {
      if (reaction.emoji.name === f) {
          if (page == count) return;
          reaction.users.cache.filter(u => !u.bot).forEach(user => {
            reaction.users.remove(user.id);
          });
          page++;
          var embed = embeds[page];
          m.edit({
              embed
          });
      } else if (reaction.emoji.name === b) {
          if (page == 0) return;
          reaction.users.cache.filter(u => !u.bot).forEach(user => {
            reaction.users.remove(user.id);
          });
          page--;
          var embed = embeds[page];
          m.edit({
              embed
          });
      }                               // note: writing this, i had very little knowledge of js and so its poorly written that being said...
  }).on("end", collected => {}); // todo: fix said bad code... later
} 

module.exports.config = {
  name: "inventory",
  aliases: ["inv","i"],
  use: "sell [@User]",
  description: "Check your, or another users inventory.",
  state : "gamma",
  page: 2
};