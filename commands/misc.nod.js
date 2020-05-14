const Discord = require("discord.js");
const fs = require("graceful-fs");


module.exports.run = async (client, message, args) => {
  
  let nodEmbed = new Discord.MessageEmbed()
    .setColor(client.colors["discord"])
    .addField("Nursery Rhyme (origin unknown)", "Let\u2019s all forsake,\r\nThe Land of Wake,\r\nAnd break for the Land of Nod.\r\n\r\nWhere we can try,\r\nTo touch the sky,\r\nOr dance beneath the sod.\r\n\r\nA toll for the living,\r\nA toll for the lost,\r\nA toll for the wise ones,\r\nWho tally the cost,\r\n\r\nSo let\u2019s escape,\r\nDue south of \u2009Wake,\r\nAnd make for the Land of Nod.\r\n");
    message.channel.send(nodEmbed);
  
} 

module.exports.config = {
  name: "nod",
  aliases: [],
  use: "nod",
  description: "Outputs nod poem.",
  state : "gamma",
  page: -1
};