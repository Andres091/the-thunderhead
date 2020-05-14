const Discord = require("discord.js");
const fs = require("graceful-fs");
const reminds = require("../dynamic/reminds.json");

module.exports.run = async (client, message, args  ) => {

    if (!(reminds[message.author.id])) reminds[message.author.id] = [];

    var date = new Date();
    var time = args[0];
    if (!time) return message.reply(client.msg["remindme_time_undefined"]);
    if (!time.match(/[s,m,h,d,w,y]/g)) return message.channel.send(client.msg["remindme_time_invalid"]);
    if (!(args[1])) return message.channel.send(client.msg["remindme_reminder_undefined"]);
    var reminderText = message.content.split(" ").slice(2).join(" ");

    var strunit = time.slice(-1);
    var unit = 1;
    if (strunit === "s") unit = 1;
    if (strunit === "m") unit = 60;
    if (strunit === "h") unit = 3600;
    if (strunit === "d") unit = 86400;
    if (strunit === "w") unit = 604800;
    if (strunit === "y") unit = 31557600;

  time = (time.slice(0, -1));
    var inted = parseInt(time);
    var newTime = new Date();
    newTime = (date.getTime() + (unit * 1000 * time));
    date = date.getTime() + (unit * 0);
    reminds[message.author.id].push({
        "reminder": reminderText,
        "time": newTime
    });
  
    message.channel.send(client.msg["remindme_success"]);
} 

module.exports.config = {
  name: "remindme",
  aliases: ["remind", "r"],
  use: "remindme [Time] [Reminder]",
  description: "Add a reminder so you don't forget",
  state : "gamma",
  page: 1
};