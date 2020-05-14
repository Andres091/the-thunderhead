const Discord = require("discord.js");
const fs = require("graceful-fs");

// This is a command template. I hope its self documenting so you don't have to sift through my god-awful code! ^.^

module.exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return;
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
