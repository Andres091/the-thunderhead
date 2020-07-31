const Discord = require("discord.js");
const fs = require("graceful-fs");
module.exports.run = async (client, message, args  ) => {
  
  const randomChimpEvents = [
    "https://bigrat.monster/monkeys/CwQRLGK.mp4?.gif",
    "https://bigrat.monster/monkeys/Monkey_Orange.gif",
    "https://bigrat.monster/monkeys/ShallowUnhealthyDeermouse-size_restricted.gif",
    "https://bigrat.monster/monkeys/chimp.gif",
    "https://bigrat.monster/monkeys/curiouswhat.gif",
    "https://bigrat.monster/monkeys/monkeyboat.gif",
    "https://bigrat.monster/monkeys/monkeydabke.gif",
    "https://bigrat.monster/monkeys/monkeylick.gif",
    "https://bigrat.monster/monkeys/monkeymoney.gif",
    "https://bigrat.monster/monkeys/orangutan.gif",
    "https://bigrat.monster/monkeys/piere.gif",
    "https://bigrat.monster/monkeys/telephonemonkey.gif"
  ]; 
  
  message.channel.send(randomChimpEvents[Math.floor(Math.random() * randomChimpEvents.length)]);
  
} 

module.exports.config = {
  name: "randomchimpevent",
  aliases: ["funnymonkey"],
  use: "randomchimpevent",
  description: "Truly, a random chimp event.",
  state : "gamma",
  page: -1
};
