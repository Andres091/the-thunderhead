const Discord = require("discord.js");
const fs = require("graceful-fs");
let msgs = require("../dynamic/msgs.json")
// todo: something with aliases

module.exports.run = async (client, message, args  ) => {
  let languageDataString = ""; //Have it as a string (now i wish i could delcare as str)  
  for (let languageCode in msgs) {
    languageDataString += `${msgs[languageCode]["flag"]}  ${msgs[languageCode].aliases[0]}: ${languageCode} (${msgs[languageCode]["completion"]}% Complete)\n`;
  }
  let undefinedArgsZeroEmbed = new Discord.MessageEmbed()
    .setTitle("🌎")
    .setDescription(client.msg["language_undefined"])
    .addField("Languages", languageDataString)
    .setColor(client.colors["discord"]);
  if (!args[0]) return message.channel.send (undefinedArgsZeroEmbed);

  let desiredLanguage = args[0].toLowerCase();
  if (!msgs[desiredLanguage]) return message.channel.send(undefinedArgsZeroEmbed)
  client.prefs.set(message.author.id, desiredLanguage, "language");
  message.channel.send("✅")

} 


module.exports.config = {
  name: "language",
  aliases: [],
  use: "lang",
  description: "Set the language I speak to you in! If I do not have your prefered language on hand, you can help translate.",
  state : "gamma",
  page: -1
};