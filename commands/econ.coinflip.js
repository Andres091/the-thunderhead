const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require('discord-economy');
const config = require("../static/config.json"); 

module.exports.run = async (client, message, args) => {
  
  var user = message.mentions.users.first();
  var amount = args[1];
  var side = args[2];
  
  if (!user) return message.reply(client.msg["coinflip_user_undefined"]);
  if (!amount) return message.reply(client.msg["coinflip_amount_undefined"]);
  if (!side) return message.reply(client.msg["coinflip_side_undefined"]);
  
  if (side.toLowerCase() !== "heads" && side.toLowerCase() !== "tails") return message.reply(client.msg["coinflip_side_invalid"]);
  side = side.toLowerCase();
  var output = await eco.FetchBalance(message.author.id);
  var _output = await eco.FetchBalance(user.id);
  if (_output.balance < amount || output.balance < amount || isNaN(amount) || amount < 1 || amount != Math.floor(amount)) return message.reply(client.msg["coinflip_amount_invalid"]);
  
  if (message.author.id === user.id) return message.channel.send(client.msg["coinflip_user_invalid"]);
  message.channel.send(client.msg["coinflip_initiate"].replace("[@USER]", `<@!${user.id}>`).replace("[PREFIX]", config.prefix));
  
  try {
      var response = await message.channel.awaitMessages(message2 => message2.author.id === user.id && (message2.content === config.prefix + "acceptcf" || message2.content === config.prefix + "cfaccept" || message2.content === config.prefix + "accept" || message2.content === config.prefix + "cfyes"), {
              max: 1,
              time: 13e3
          });
  } catch (err) {
      console.error(err);
      return message.channel.send(client.msg["coinflip_rejected"].replace("[PREFIX]", config.prefix));
  }
  

    if (!response.first()) return message.channel.send(client.msg["coinflip_rejected"].replace("[PREFIX]", config.prefix));  
    const choice = (response.first().content);

  
      var randoms = ["tails", "tails", "heads", "tails", "tails", "tails", "heads", "heads", "heads", "heads", "tails", "tails", "heads", "tails", "heads", "heads", "tails", "tails", "heads", "tails",
          "heads", "heads", "heads", "heads", "tails", "heads", "tails", "tails"
      ]; // note: there is most likely a more efficient way to get better randomness. again, if you know of a way and wanna help reach out to me or submit a pr on github
      
      var item = randoms[Math.floor(Math.random() * randoms.length)];
      if (side === item) {
          item.charAt(0).toUpperCase();
          message.channel.send(client.msg["coinflip_success"].replace("[ITEM]", item).replace("[@USER]", `<@!${message.author.id}>`).replace("[AMOUNT]", amount).replace("[CURRENCY]", client.emotes["currency_vibes"]));
          var transfer = await eco.Transfer(user.id, message.author.id, amount);
          var balText = `${message.author.username} won **${amount}** ${client.emotes["currency_vibes"]} from  ${user.username}.`;
          var balembed = new Discord.MessageEmbed().addField(message.author.username, balText).setColor(client.colors["gamble_green"]);
          const channel = client.channels.cache.get(config["econ_log_id"]);
          if (message.guild.id != "625021277295345667") channel.send(balembed);
          if (message.guild.id != "625021277295345667") channel.send(`(${user.id}) => (${message.author.id})`);
      } else {
          item.charAt(0).toUpperCase();
          message.channel.send(client.msg["coinflip_success"].replace("[ITEM]", item).replace("[@USER]", `<@!${user.id}>`).replace("[AMOUNT]", amount).replace("[CURRENCY]", client.emotes["currency_vibes"]));
          var transfer = await eco.Transfer(message.author.id, user.id, amount);
          var balText = `${user.username} won **${amount}** ${client.emotes["currency_vibes"]} from ${message.author.username}.`;
          var balembed = new Discord.MessageEmbed().addField(user.username, balText).setColor(client.colors["gamble_green"]);
          const channel = client.channels.cache.get(config["econ_log_id"]);
          if (message.guild.id != "625021277295345667") channel.send(balembed);
          if (message.guild.id != "625021277295345667") channel.send(`(${message.author.id}) => (${user.id})`);
      }
  


  
} 

module.exports.config = {
  name: "coinflip",
  aliases: ["cf"],
  use: "coinflip [@User] [Amount] [Heads or Tails]",
  description: "Coinflip a user and see who wins. They must accept it with " + config.prefix + "cfaccept",
  state : "gamma",
  page: 2
};