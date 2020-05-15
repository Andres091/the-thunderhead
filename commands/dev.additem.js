const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require('discord-economy');
const config = require("../static/config.json"); 

module.exports.run = async (client, message, args) => {
  if (config.sudo.indexOf(message.author.id) < 0) return; // Dev Only
      
  let owner = args[0];
  if (!owner) owner = "marketplace";
  owner = owner.replace(/[@!<>]/g, "");
  if (!client.items.get(owner)) client.items.set(owner, {});
  let name = args[1];
  let type = args[2];
  let id = args[3];
  let emoji = args[4].replace(":", "");
  let cost = args[5];
  let imageURL = args[6];
  let description = args.slice(7).join(" ");
  if (!type || !name || !id || !emoji || !cost || !imageURL || !description) return message.channel.send("Missing Field");
  client.items.set(owner, id) = {
      name: name,
      type: type,
      emoji: emoji,
      description: description,
      image: imageURL,
      cost: cost,
      sellerid: "marketplace"
  };
  
} 

module.exports.config = {
  name: `${config["developer_prepended_prefix"]}additem`,
  aliases: [],
  use: `${config["developer_prepended_prefix"]}additem [@User] [Name] [Type] [id] [:emoji:] [cost] {imageURL} [description]`,
  description: "Add an item to the marketplace",
  state : "delta",
  page: 0
};