const Discord = require("discord.js");
const fs = require("graceful-fs");
var weather = require("weather-js");
module.exports.run = async (client, message, args  ) => {
  
       if (!args[0]) return message.channel.send(client.msg["weather_undefined"]);
        await weather.find({
            search: args.join(" "),
            degreeType: "F"
        }, function (err, result) {
            if (!result || !result[0]) return message.channel.send(client.msg["weather_rejected"]);
              
            // Leaving this garbage as-is for now. If you have a weather API without the yucky MSN icons, tell me. Please.
            // rekwirements:
            //   - duoenst need authorization
            //   - has icons that dont look like puke
            //   - not a 4d puzle to use
            //  -timezonessss
          
            var current = result[0].current;
            var location = result[0].location;
            let weatherEmbed = new Discord.MessageEmbed()
            .setDescription(`**${current.skytext}**`)
            .setAuthor(`Weather for ${current.observationpoint}`)
            .setThumbnail(current.imageUrl)
            .setColor(client.colors["discord"])
            .addField("Timezone ", `UTC ${location.timezone}`, true)
            .addField("Degree Type ", location.degreetype, true)
            .addField("Temperature ", `${current.temperature} Degrees`, true)
            .addField("Feels Like ", `${current.feelslike} Degrees`, true)
            .addField("Winds ", current.winddisplay, true)
            .addField("Humidity ", `${current.humidity}%`, true);
            message.channel.send(weatherEmbed);
        });
  
} 

module.exports.config = {
  name: "weather",
  aliases: [],
  use: "weather [Location]",
  description: "Check on the weather",
  state : "gamma",
  page: 1
};