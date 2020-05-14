const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require("discord-economy");
const config = require("../static/config.json");

module.exports.run = async (client, message, args) => {
  const m = await message.channel.send(client.msg["ping_pending"]);
  m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
};

module.exports.config = {
  name: `${config["developer_prepended_prefix"]}ping`,
  aliases: [],
  use: `${config["developer_prepended_prefix"]}ping`,
  description: "Returns latency and API latency",
  state: "gamma",
  page: 0
};
