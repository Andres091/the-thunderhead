const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require('discord-economy');
const config = require("../static/config.json"); 

module.exports.run = async (client, message, args) => {
   if (config.sudo.indexOf(message.author.id) < 0) return; // Dev Only
      
   if (!client.scheduled_items.get("items")) client.scheduled_items.set("items", {});
    let name = args[0];
    let theftSuccess = args[1];
    let antiTheftSuccess = args[2];
    let cost = args[3];
    let description = args.slice(4).join(" ");
    if (!name || !cost || !theftSuccess || !antiTheftSuccess || !description) return message.channel.send("Missing Field");
    let id = name + Date.now().toString();
    client.scheduled_items.set("items", id, {
      name: (name.charAt(0).toUpperCase() + name.toLowerCase().slice(1)).replace("Thunder", "Thunder Banking Solutions"),
      type: "Weapon",
      emoji: "⚔️",
      description: description + `\nStealth: ${theftSuccess}%\nDefence: ${antiTheftSuccess}%`,
      image: `https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${name.toLowerCase()}.png`,
      cost: cost,
      theftSuccess: theftSuccess,
      antiTheftSuccess: antiTheftSuccess,
      sellerid: "marketplace"
  });
    message.channel.send(client.scheduled_items.get("items")[id].name + " was added to the automatic market list.")
  
} 

module.exports.config = {
  name: `${config["developer_prepended_prefix"]}scheduleweapon`,
  aliases: [],
  use: `${config["developer_prepended_prefix"]}scheduleweapon [Name] [%Success] [%Defense] [cost] [description]`,
  description: "Add a weapon to the automatic market list",
  state : "delta",
  page: 0
};