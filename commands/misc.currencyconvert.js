const Discord = require("discord.js");
const fs = require("graceful-fs");
const alpha = require('alphavantage')({ key: `thunder-${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}` });


module.exports.run = async (client, message, args  ) => {
  
  alpha.crypto.daily(args[0], args[1]).then(data => {
    console.log(data);
  });
  
} 

module.exports.config = {
  name: "currencyconvert",
  aliases: [],
  use: "currencyconvert [From] [To]",
  description: "Compart currency exchange rates",
  state : "gamma",
  page: -1
};