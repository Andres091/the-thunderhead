const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require('discord-economy');
const config = require("../static/config.json");
const altlist = require("../dynamic/altlist.json");

module.exports.run = async (client, message, args) => {
  let requiredPermission = "USE_EXTERNAL_EMOJIS"; 
  if (!message.member.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_user_permission_"+requiredPermission]);
  if (!message.guild.me.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_client_permission_"+requiredPermission]);

  let requiredPermission = "EMBED_LINKS"; 
  if (!message.member.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_user_permission_"+requiredPermission]);
  if (!message.guild.me.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_client_permission_"+requiredPermission]);

  
  let dailyAmount = Math.floor(Math.random() * config["daily_high"]) + config["daily_low"];
        if (altlist.alts.indexOf(message.author.id) >= 0) dailyAmount = 3;
        var output = await eco.Daily(message.author.id);
        //output.updated will tell you if the user already claimed his/her daily yes or no.
        if (output.updated) {
            var dailyProfile = await eco.AddToBalance(message.author.id, dailyAmount);
            message.channel.send((client.msg["daily_success"].replace("[DAILYAMOUNT]", dailyAmount).replace("[CUR]", client.emotes["currency_vibes"])).replace("[NEWBALANCE]", dailyProfile.newbalance).replace("[CUR]", client.emotes["currency_vibes"]));
            const channel = client.channels.cache.get(config["eco_log_id"]);
            if (message.guild.id != "625021277295345667") channel.send(`${message.author.username} (${message.author.id}) did their daily and got ${dailyAmount} leaving them with ${dailyProfile.newbalance} ${client.emotes["currency_vibes"]}`);
        } else message.channel.send(client.msg["daily_failure"].replace("[TIMETOWAIT]", output.timetowait));

  
} 

module.exports.config = {
  name: "daily",
  aliases: [],
  use: "daily",
  description: "Your daily BIG (Basic Income Guarantee)",
  state : "gamma",
  page: 2
};