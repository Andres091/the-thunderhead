const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require('discord-economy');
const config = require("../static/config.json"); 
const altlist = require("../dynamic/altlist.json");
module.exports.run = async (client, message, args  ) => {

  var user = message.mentions.users.first()
  let robState = false;
  if (!user) return message.reply(client.msg["rob_user_undefined"]);
  var output = await eco.FetchBalance(message.author.id);
  if (output.balance < 50) return message.reply(client.msg["rob_author_insufficient"]);
  var _output = await eco.FetchBalance(user.id);
  if (_output.balance < 50) return message.reply(client.msg["rob_user_insufficient"]);
  var output = await eco.Daily(message.author.id);
  let isAlt = 0;
  if (altlist.alts.indexOf(message.author.id) >= 0) isAlt = 32767;
  if (output.updated) {
      message.channel.send(client.msg["rob_initiate"].replace("[PREFIX]", config.prefix).replace("[@USER]", `<@!${user.id}>`));
      try {
          var response = await message.channel.awaitMessages(message2 => message2.author.id === user.id && (message2.content === config.prefix + "deny" || message2.content === config.prefix + "s" || message2.content ===
              config.prefix + "no" || message2.content ===config. prefix + "stoptheif"), {
                  max: 1,
                  time: 1e4
              });
      } catch (err) {
          message.channel.send(client.msg["rob_primary_success"]);
          var stealthIncrease = 0;
          for (var item in client.items.get(message.author.id)) {
              item = client.items.get(message.author.id)[item];
              if (item.type === "Weapon") stealthIncrease += parseInt(item["theftSuccess"]);
          }
          for (var item in client.items.get(user.id)) {
              item = client.items.get(user.id)[item]
              if (item.type === "Weapon") stealthIncrease -= parseInt(item["antiTheftSuccess"]);
          }
          stealthIncrease = parseInt(stealthIncrease);
          let stealthCheck = Math.floor((Math.random() * 10) + 1);
          if (!(stealthCheck > (isAlt + (100 - (config["rob_win_chance"] + stealthIncrease)) / 10))) return message.channel.send(client.msg["rob_primary_failure"]);
          var transfer = await eco.Transfer(user.id, message.author.id, 3 * stealthCheck - 2);
          var balText = (client.msg["rob_secondary_success"]).replace("[AUTHOR]", message.author.username).replace("[AMOUNT]", (3 * stealthCheck - 2)).replace("[CURRENCY]", client.emotes["currency_vibes"]).replace("[USER]", user.username);
          var balembed = new Discord.MessageEmbed().addField(message.author.username, balText).setColor(client.colors["gamble_green"]);
          message.channel.send(balembed);
          const channel = client.channels.get(config["econ_log_id"]);
          if (message.guild.id != "625021277295345667") channel.send(balembed);
          if (message.guild.id != "625021277295345667") channel.send(`(${user.id}) => (${message.author.id})`);
          robState = true;
      }
      //punishment
      if (robState) return;
      var transfer = await eco.Transfer(message.author.id, user.id, config["rob_penalty"]);
      var balText = (client.msg["rob_secondary_failure"]).replace("[AUTHOR]", message.author.username).replace("[PENALTY]", config["rob_penalty"]).replace("[CURRENCY]", client.emotes["currency_vibes"]).replace("[USER]", user.username);
      var balembed = new Discord.MessageEmbed().addField(user.username, balText).setColor(client.colors["gamble_green"]);
      message.channel.send(balembed);
      const channel = client.channels.cache.get(config["econ_log_id"]);
      if (message.guild.id != "625021277295345667") channel.send(balembed);
      if (message.guild.id != "625021277295345667") channel.send(`(${message.author.id}) => (${user.id})`);
  } message.channel.send(client.msg["rob_rejected"]);

} 

module.exports.config = {
  name: "rob",
  aliases: ["steal", "theft", "pickpocket", "liberateofvibes"],
  use: "coinflip [@User] [Amount] [Heads or Tails]",
  description: "Rob a user, but be careful. It won't let you use your daily for the rest of the day.",
  state : "gamma",
  page: 2
};