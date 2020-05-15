const Discord = require("discord.js");
const fs = require("graceful-fs");

module.exports.run = async (client, message, args  ) => {
  
    var toSell = args[0];
    if (!client.items.get(message.author.id)[toSell]) return message.channel.send(client.msg["sell_rejected"]);
    var item = client.items.get(message.author.id)[toSell];
    var cost = item.cost;
    var robeColor = item.robecolor;
    item.sellerid = message.author.id;
    item.ownerid = "marketplace";
    var itemName = item.name;
    client.items.set("marketplace", (client.items.get(message.author.id)[toSell]), toSell)
    client.items.delete(message.author.id, toSell);
    message.channel.send(client.msg["sell_success"])
    if (!robeColor) return;
    let robeRole = client.guilds.cache.get(`625021277295345667`).roles.cache.find(r => r.name === (robeColor.charAt(0).toUpperCase() + robeColor.slice(1).toLowerCase() + " Robe").replace("Tonist Robe", "Tonist Frock"));
    if (robeRole) { //robe role and thunder nonsense
        client.guilds.cache.get(`625021277295345667`).member(message.author.id).roles.remove(robeRole)
        message.channel.send(`The ${robeRole.name} role was unassigned.`);
    }
  
} 

module.exports.config = {
  name: "sell",
  aliases: [],
  use: "sell [Item]",
  description: "Sell an item to the marketplace",
  state : "gamma",
  page: 2
};