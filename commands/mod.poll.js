const Discord = require("discord.js");
const fs = require("graceful-fs");

// This is a command template. I hope its self documenting so you don't have to sift through my god-awful code! ^.^

module.exports.run = async (client, message, args) => {
  let requiredPermission = "MANAGE_MESSAGES"; 
  if (!message.member.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_user_permission_"+requiredPermission]);
  if (!message.guild.me.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_client_permission_"+requiredPermission]);
   


  if (!args[0])
    return message.channel
      .send(client.msg["poll_undefined"])
      .then(message.channel.bulkDelete(1))
      .then(msg =>
        msg.delete({
          timeout: 1000000000000
        })
      );
  message.channel.bulkDelete(1);

  let pollEmbed = new Discord.MessageEmbed()
    .setColor(client.colors["discord"])
    .setTitle("Poll")
    .setDescription(`${args}`.split(",").join(" "));
  message.channel.send(pollEmbed)
    .then(async function(msg) {
      await msg.react("✅");
      await msg.react("⛔");
    })
    .catch(function() {});
};

module.exports.config = {
  name: "poll",
  aliases: [],
  use: "poll [Question]",
  description: "Create a poll!",
  state: "gamma",
  page: 4
};
