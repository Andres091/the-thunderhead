const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require('discord-economy');
const authFile = require("../auth.json");
const auth = authFile.stable;  // change this to canary later maybe
const config = require("../static/config.json"); 
const altlist = require("../dynamic/altlist.json");
const DBL = require("dblapi.js");
const workedRecently = new Set(); 

module.exports.run = async (client, message, args) => {
  const dbl = new DBL(auth.dbl, client);

  let hasVoted = false;
  try {
      hasVoted = await dbl.hasVoted(message.author.id);
  } catch (err) {
      hasVoted = false;

  }

  
  let failurerate = 40 + (hasVoted * 20);
  if (altlist.alts.indexOf(message.author.id) >= 0) failurerate = 100;
  if (workedRecently.has(message.author.id)) {
      message.channel.send(client.msg["work_rejected"]);
  } else {
      workedRecently.add(message.author.id);
      setTimeout(() => {
          workedRecently.delete(message.author.id);
      }, 300000);
      var output = await eco.Work(message.author.id, {
          failurerate: failurerate,
          money: Math.floor((Math.random() * 9) + 1),
          jobs: ["null"]
      })

      if (output.earned == 0) return message.reply(client.msg["work_failure"].replace("[PREFIX]", config.prefix))
      message.channel.send(client.msg["work_success"].replace("[EARNED]", output.earned).replace("[BALANCE]", output.balance).replace("[CURRENCY]", client.emotes["currency_vibes"]).replace("[CURRENCY]", client.emotes["currency_vibes"]))
    }
}
module.exports.config = {
  name: "work",
  aliases: ["moneymaker"],
  use: "work",
  description: "Try to work to earn money, five minute cooldown.",
  state : "gamma",
  page: 2
};
