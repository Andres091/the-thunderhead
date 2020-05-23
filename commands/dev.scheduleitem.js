const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require('discord-economy');
const config = require("../static/config.json"); 

module.exports.run = async (client, message, args) => {
  if (config.sudo.indexOf(message.author.id) < 0) return; // Dev Only
      
  if (!client.scheduled_items.get("items")) client.scheduled_items.set("items", {});
  let name = args[1];
  let type = args[2];
  let emoji = args[3].replace(":", "");
  let cost = args[4];
  let imageURL = args[5];
  let description = args.slice(6).join(" ");
  if (!type || !name || !emoji || !cost || !imageURL || !description) return message.channel.send("Missing Field");
  let id = name + Date.now().toString();
  client.scheduled_items.set("items", id, {
      name: name,
      type: type,
      emoji: emoji,
      description: description,
      image: imageURL,
      cost: cost,
      sellerid: "marketplace"
  });
  message.channel.send(client.scheduled_items.get("items")[id].name + " was added to the automatic market list.")
} 

module.exports.config = {
  name: `${config["developer_prepended_prefix"]}scheduleitem`,
  aliases: [],
  use: `${config["developer_prepended_prefix"]}scheduleitem [Name] [Type] [:emoji:] [cost] {imageURL} [description]`,
  description: "Add an item to the automatic marketplace list",
  state : "delta",
  page: 0
};