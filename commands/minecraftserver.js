const Discord = require("discord.js");
const fs = require("graceful-fs");
const exec = require('child_process').exec;
const config = require("../static/config.json");


module.exports.run = async (client, message, args) => {
  if ((config.sudo.indexOf(message.author.id) < 0) && !(message.author.id === "614634259021430786")) return; // Dev Only

    var code = "cd .. ; cd .. ; cd EventPaperServer ; ./start.sh";
    if (args[0] && args[0] === "reset") code = "cd .. ; cd .. ; cd EventPaperServer ; ./reset.sh";
    const logchannel = client.channels.cache.get("736317106877890632");
    
    if (message.author.bot) return;
    const myShellScript = exec(code);
    myShellScript.stdout.on('data', (data) => {
       logchannel.send(`\`\`\`\n${data}\n\`\`\``);
    });
    myShellScript.stderr.on('data', (data) => {
        logchannel.send(`\`\`\`\n${data}\n\`\`\``);
    });
};

module.exports.config = {
  name: `${config["developer_prepended_prefix"]}minecraftserver`,
  aliases: ["mcs"],
  use: `${config["developer_prepended_prefix"]}minecraftserver [Reset/No]`,
  description: "Start the minecraft server",
  state: "delta",
  page: 0
};
