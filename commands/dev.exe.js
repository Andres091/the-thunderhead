const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require("discord-economy");
const algebra = require("nerdamer");
const config = require("../static/config.json");

function clean(text) {
  if (typeof text === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else return text;
}

module.exports.run = async (client, message, args) => {
  if (config.sudo.indexOf(message.author.id) < 0) return; // Dev Only

  try {
    const code = args.join(" ");
    let evaled = eval(code);
    if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
  } catch (err) {
    message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
  }
};

module.exports.config = {
  name: `${config["developer_prepended_prefix"]}exe`,
  aliases: ["eval"],
  use: `${config["developer_prepended_prefix"]}exe [Javascript]`,
  description: "Execute code",
  state: "delta",
  page: 0
};
