const Discord = require("discord.js");
const fs = require("graceful-fs");

// The point of this command is to test my VS Code setup lmao. that said, i really like the intro to scythe

module.exports.run = async (client, message, args  ) => {
  
  let curieJournalEmbed = new Discord.MessageEmbed()
    .setDescription(`We must, by law, keep a record of the innocents we kill.\nAnd as I see it, they’re all innocents. Even the guilty. Everyone is guilty of something, and everyone still harbors a memory of childhood innocence, no matter how many layers of life wrap around it. Humanity is innocent; humanity is guilty, and both states are undeniably true.\nWe must, by law, keep a record.\nIt begins on day one of apprenticeship—but we do not officially call it “killing.” It’s not socially or morally correct to call it such. It is, and has always been, “gleaning,” named for the way the poor would trail behind farmers in ancient times, taking the stray stalks of grain left behind. It was the earliest form of charity. A scythe’s work is the same. Every child is told from the day he or she is old enough to understand that the scythes provide a crucial service for society. Ours is the closest thing to a sacred mission the modern world knows.\nPerhaps that is why we must, by law, keep a record. A public journal, testifying to those who will never die and those who are yet to be born, as to why we human beings do the things we do. We are instructed to write down not just our deeds but our feelings, because it must be known that we do have feelings. Remorse. Regret. Sorrow too great to bear. Because if we didn’t feel those things, what monsters would we be?`)
    .setFooter("— From the gleaning journal of H.S. Curie")
    .setColor(client.colors["discord"]);

    message.channel.send(curieJournalEmbed);
} 

module.exports.config = {
  name: "intro",
  aliases: [],
  use: "intro",
  description: "— From the gleaning journal of H.S. Curie",
  state : "gamma",
  page: -1
};