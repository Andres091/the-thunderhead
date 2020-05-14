const Discord = require("discord.js");
const fs = require("graceful-fs");
var weather = require("weather-js");
module.exports.run = async (client, message, args  ) => {
  
       if (!args[0]) return message.channel.send(client.msg["time_undefined"]);
        await weather.find({
            search: args.join(" "),
            degreeType: "F"
        }, function (err, result) {
            if (!result || !result[0]) return message.channel.send(client.msg["time_rejected"]);
          
            // this is almost as much of a dumpster fire as the weather command; maybe more. todo: I also need to add timezone support 
            let utcDate = Date.now();
           
            let date = new Date(utcDate + (result[0].location.timezone * 60 * 60 * 1000));
            let days = ["Magolor Day","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            let years = ["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"]; // Confirmed Scythe Cannon that They Used Chinese Calden and just added an animal each year
            
            let timeEmbed = new Discord.MessageEmbed()
              .setTitle(result[0].location.name)
              .addField("Day", days[date.getDay()], true)
              .addField("Time", `${date.getHours()}:${date.getMinutes()}`, true)
              .addField("Year", `Year of the: ${years[date.getFullYear() - 2020]} || ${date.getFullYear()}`)
              .setColor(client.colors["discord"]);
            message.channel.send(timeEmbed);
        });
  
} 

module.exports.config = {
  name: "time",
  aliases: [],
  use: "time [Location]",
  description: "Check on the time somewhere far away!",
  state : "gamma",
  page: 1
};