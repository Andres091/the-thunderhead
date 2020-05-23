const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require('discord-economy');
const config = require("../static/config.json"); 

module.exports.run = async (client, message, args) => {
  if (config.sudo.indexOf(message.author.id) < 0) return; // Dev Only

    if (!client.scheduled_items.get("items")) client.scheduled_items.set("items", {});
    let color = args[0];
    let cost = args[1]
    let description = args.slice(2).join(" ");
    if (!cost || !color || !description) return message.channel.send("Missing Field");
    let id = (color.charAt(0).toUpperCase() + color.toLowerCase().slice(1) + " Robe").replace("Tonist Robe", "Tonist Frock") + Date.now().toString();
    client.scheduled_items.set("items", id, {
        name: (color.charAt(0).toUpperCase() + color.toLowerCase().slice(1) + " Robe").replace("Tonist Robe", "Tonist Frock"),
        type: "Robe",
        emoji: "👗",
        description: description,
        image: `https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${color.toLowerCase()}.png`,
        cost: cost,
        robecolor: color.toLowerCase(),
        sellerid: "marketplace"
    });
    message.channel.send(client.scheduled_items.get("items")[id].name + " was added to the automatic market list.")
  
} 

module.exports.config = {
  name: `${config["developer_prepended_prefix"]}schedulerobe`,
  aliases: [],
  use: `${config["developer_prepended_prefix"]}schedulerobe [Color] [cost] [description]`,
  description: "Add a robe to the automatic market list",
  state : "delta",
  page: 0
};