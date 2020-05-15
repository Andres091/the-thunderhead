const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require('discord-economy');
const config = require("../static/config.json"); 

module.exports.run = async (client, message, args) => {
  if (config.sudo.indexOf(message.author.id) < 0) return; // Dev Only
    let owner = "marketplace";
    if (!client.items.get(owner)) client.items.set(owner, {});
    let color = args[0];
    let id = args[1]
    let cost = args[2]
    let description = args.slice(3).join(" ");
    if (!id || !cost || !color || !description) return message.channel.send("Missing Field");
    client.items.set(owner, id) = {
        name: (color.charAt(0).toUpperCase() + color.toLowerCase().slice(1) + " Robe").replace("Tonist Robe", "Tonist Frock"),
        type: "Robe",
        emoji: "👗",
        description: description,
        image: `https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${color.toLowerCase()}.png`,
        cost: cost,
        robecolor: color.toLowerCase(),
        sellerid: "marketplace"
    };
    message.channel.send(client.items.get(owner)[id].name + " was added.")
  
} 

module.exports.config = {
  name: `${config["developer_prepended_prefix"]}addrobe`,
  aliases: [],
  use: `${config["developer_prepended_prefix"]}addrobe [Color] [id] [cost] [description]`,
  description: "Add a robe to the market",
  state : "delta",
  page: 0
};