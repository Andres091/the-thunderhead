const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require('discord-economy');
const config = require("../static/config.json");
var eco = require('discord-economy');

module.exports.run = async (client, message, args) => {
 
    let requiredPermission = "USE_EXTERNAL_EMOJIS"; 
    if (!message.member.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_user_permission_"+requiredPermission]);
    if (!message.guild.me.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_client_permission_"+requiredPermission]);
  
    requiredPermission = "EMBED_LINKS"; 
    if (!message.member.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_user_permission_"+requiredPermission]);
    if (!message.guild.me.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_client_permission_"+requiredPermission]);
    
    requiredPermission = "USE_EXTERNAL_EMOJIS"; 
    if (!message.member.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_user_permission_"+requiredPermission]);
    if (!message.guild.me.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_client_permission_"+requiredPermission]);
  
     requiredPermission = "MANAGE_MESSAGES"; 
    if (!message.guild.me.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_client_permission_"+requiredPermission]);
  
    requiredPermission = "ADD_REACTIONS"; 
    if (!message.member.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_user_permission_"+requiredPermission]);
    if (!message.guild.me.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_client_permission_"+requiredPermission]);
  
 
 
    if (!message.guild.member(client.user).hasPermission("MANAGE_MESSAGES")) return; // todo add the uh perm ask system i think...??????? 
    if (!message.guild.member(client.user).hasPermission("ADD_REACTIONS")) return;
   
  if (client.items.get("marketplace")[0]) {
        message.channel.send(client.msg["market_undefined"]);
    } else {
        var embeds = [];
        var myItems = client.items.get("marketplace");
        var count = -1;
        for (var item in myItems) {
            count++;
            var footer = item;
            item = myItems[item];
            var title = `${item.name} ${item.emoji}`;
            var description = item.description;
            var image = item.image;
            var type = item.type;
            var cost = item.cost
            var seller = item.sellerid
            embeds.push({
                title: title,
                description: description,
                color: 4439665,
                footer: {
                    text: `Cost: ${cost} || Buy with ${config.prefix}buy ${footer}`
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
        message.channel.send("Stock: " + (count + 1) + " items.")
        var b = "◀";
        var f = "▶";
        var page = args[0] - 1;
        if (!embeds[page - 1]) page = 0; // -1 because computers start at 0 :eye_roll_emoji_keanu_chungus_wholsome:
        var embed = embeds[page];
        const m = await message.channel.send({embed});
        m.react(b).then(() => m.react(f));
        const filter = (reaction, user) => {
            return (
                [b, f].includes(reaction.emoji.name) && user.id === message.author.id);
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
            }
        }).on("end", collected => { });
    }

} 

module.exports.config = {
  name: "market",
  aliases: ["marketplace"],
  use: "market",
  description: "Take a look at the market",
  state : "gamma",
  page: 2
};