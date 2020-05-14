const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require("discord-economy");
const config = require("../static/config.json");


module.exports.run = async (client, message, args) => {
  if (config.sudo.indexOf(message.author.id) < 0) return; // Dev Only
    let user = args[0];
    if (!user) user = message.author.id;
    user = client.users.cache.get(user.replace(/[@!<>]/g, ""));
    var grandslayerRole = client.guilds.cache.get(`625021277295345667`).roles.cache.find(role => role.name === "Grandslayer");
    client.guilds.cache.get(`625021277295345667`).member(user).roles.add(grandslayerRole);
};

module.exports.config = {
  name: `${config["developer_prepended_prefix"]}gs`,
  aliases: [],
  use: `${config["developer_prepended_prefix"]}gs [@User]`,
  description: "Grandslayer a user",
  state: "delta",
  page: 0
};
