const Discord = require("discord.js");
const fs = require("graceful-fs");
const exec = require('child_process').exec;
const config = require("../static/config.json");


module.exports.run = async (client, message, args) => {
  if (config.sudo.indexOf(message.author.id) < 0) return; // Dev Only

    const code = args.join(" ");

    if (message.author.bot) return;
    const myShellScript = exec(code);
    myShellScript.stdout.on('data', (data) => {
       message.channel.send(`\`\`\`\n${data}\n\`\`\``);
    });
    myShellScript.stderr.on('data', (data) => {
        message.channel.send(`\`\`\`\n${data}\n\`\`\``);
    });
};

module.exports.config = {
  name: `${config["developer_prepended_prefix"]}exe`,
  aliases: ["eval"],
  use: `${config["developer_prepended_prefix"]}exe [Javascript]`,
  description: "Execute code",
  state: "delta",
  page: 0
};
