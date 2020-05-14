const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require('discord-economy');
const config = require("../static/config.json"); 
const items = require("../dynamic/items.json"); 

module.exports.run = async (client, message, args) => {
  if (config.sudo.indexOf(message.author.id) < 0) return; // Dev Only
      
   let owner = "marketplace";
    if (!items[owner]) items[owner] = {};
    let name = args[0]
    let theftSuccess = args[1];
    let antiTheftSuccess = args[2]
    let id = args[3]
    let cost = args[4]
    let description = args.slice(5).join(" ");
    if (!name || !id || !cost || !theftSuccess || !antiTheftSuccess || !description) return message.channel.send("Missing Field");
    items[owner][id] = {
        name: (name.charAt(0).toUpperCase() + name.toLowerCase().slice(1)).replace("Thunder", "Thunder Banking Solutions"),
        type: "Weapon",
        emoji: "⚔️",
        description: description + `\nStealth: ${theftSuccess}%\nDefence: ${antiTheftSuccess}%`,
        image: `https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${name.toLowerCase()}.png`,
        cost: cost,
        theftSuccess: theftSuccess,
        antiTheftSuccess: antiTheftSuccess,
        sellerid: "marketplace"
    };
    message.channel.send(items[owner][id].name + " was added.")
  
} 

module.exports.config = {
  name: `${config["developer_prepended_prefix"]}addweapon`,
  aliases: [],
  use: `${config["developer_prepended_prefix"]}addweapon [Name] [%Success] [%Defense] [id] [cost] [description]`,
  description: "Add a weapon to the market",
  state : "delta",
  page: 0
};