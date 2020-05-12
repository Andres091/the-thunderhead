const Discord = require("discord.js");
const fs = require("graceful-fs");
module.exports.run = async (client, message, args  ) => {
  
    if (message.guild.id !== "625021277295345667") return message.channel.send(client.msg["roleme_unsupported"]);
    var role = args[0];
    if (!role) return message.channel.send(client.msg["roleme_undefined"]);
    var _r = role.toLowerCase().charAt(0).toUpperCase() + role.toLowerCase().slice(1);
    if (_r === "Artist" || _r === "Writer" || _r === "Scythe" || _r === "Spoiled" || _r === "Tonist" || _r === "Minecraft") {
        var rl = message.guild.roles.find('name', _r);
        if (message.member.roles.find(r => r.name === _r)) {
            message.member.removeRole(rl);
            message.channel.send(`The ${_r} role was unassigned.`);
        } else {
            message.member.addRole(rl);
            message.channel.send(`The ${_r} role was assigned.`);
        }
    }
    if (_r === "Unsavory") {
        if (Math.random > .988) {
            message.member.addRole(message.guild.roles.find('name', "Unsavory"));
            message.channel.send("Yes.")
        } else {
            message.channel.send("No.")
        }
    }
  
} 

module.exports.config = {
  name: "roleme",
  aliases: ["role", "roles", "iam"],
  use: "roleme [Role]",
  description: "Assign yourself a role",
  state : "gamma",
  page: 1
};