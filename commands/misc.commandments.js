const Discord = require("discord.js");
const fs = require("graceful-fs");

// I don't know why this is a command???

module.exports.run = async (client, message, args  ) => {
  
  let commandmentsEmbed = new Discord.MessageEmbed()
    .setTitle("The Scythe Commandments")
    .setDescription(`1) Thou shalt kill.\n\n2) Thou shalt kill with no bias, bigotry, or malice aforethought.\n\n3) Thou shalt grant an annum of immunity to the beloved of those who accept your coming, and to anyone else you deem worthy.\n\n4) Thou shalt kill the beloved of those who resist.\n\n5) Thou shalt serve humanity for the full span of thy days, and thy family shall have immunity as recompense for as long as you live.\n6) Thou shalt lead an exemplary life in word and deed, and keep a journal of each and every day.\n\n7) Thou shalt kill no scythe beyond thyself.\n\n8) Thou shalt claim no earthly possessions, save thy robes, ring, and journal.\n\n9) Thou shalt have neither spouse nor spawn.\n\n10) Thou shalt be beholden to no laws beyond these.`)
    .setFooter("When I was much more naive, I thought that the simplicity of the scythe commandments made them impervious to scrutiny. From whatever angle you approached them, they looked the same. Over my many years, I’ve been both bemused and horrified by how malleable and elastic they can be. The things we scythes attempt to justify. The things that we excuse.\nIn my early days, there were several scythes still alive who were present when the commandments were formed. Now none remain, all having invoked commandment number seven. I wish I would have asked them how the commandments came about. What led to each one? How did they decide upon the wording? Were there any that were jettisoned before the final ten were written in stone?\nAnd why number ten?\nOf all the commandments, number ten gives me the greatest pause for thought. For to put oneself above all other laws is a fundamental recipe for disaster.\n\n— From the gleaning journal of H.S. Curie")
    .setColor(client.colors["discord"]);

    message.channel.send(commandmentsEmbed);
} 

module.exports.config = {
  name: "commandments",
  aliases: [],
  use: "commandments",
  description: "Of all the commandments, number ten gives me the greatest pause for thought. For to put oneself above all other laws is a fundamental recipe for disaster.",
  state : "gamma",
  page: -1
};