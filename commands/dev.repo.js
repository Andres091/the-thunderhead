const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require("discord-economy");
const config = require("../static/config.json");

module.exports.run = async (client, message, args) => {
  message.channel.send(config["repository"])
};

module.exports.config = {
  name: `${config["developer_prepended_prefix"]}repo`,
  aliases: [],
  use: `${config["developer_prepended_prefix"]}repo`,
  description: "Returns the bot's repository",
  state: "gamma",
  page: 0
};
