const Discord = require("discord.js");
const fs = require("graceful-fs");
const alpha = require('alphavantage')({ key: `thunder-${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}` });


module.exports.run = async (client, message, args  ) => {
  
  alpha.forex.rate(args[0], args[1]).then(data => {
    message.channel.send(`\`\`\`json\n${JSON.stringify(data)}\`\`\``)
    //who makes their api like this??? why are there numbers prepended to json keys????
  });
  
} 

module.exports.config = {
  name: "currencyconvert",
  aliases: [],
  use: "currencyconvert [From] [To]",
  description: "Compart currency exchange rates. here ya go vend",
  state : "gamma",
  page: -1
};