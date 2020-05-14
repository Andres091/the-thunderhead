const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require('discord-economy');
const config = require("../static/config.json");

module.exports.run = async (client, message, args) => {
        if (message.mentions.users.first()) {
            let output = await eco.Leaderboard({
                filter: x => x.balance > 50,
                search: message.mentions.users.first().id
            });
            message.channel.send(`${(output).toString().replace("Not found", "?")} - ${message.mentions.users.first().username}`);
        } else {
            eco.Leaderboard({}).then(async users => { //async
                if (users[0]) var firstplace = await client.users.fetch(users[0].userid); // Computers start counting at 0.
                if (users[1]) var secondplace = await client.users.fetch(users[1].userid); 
                if (users[2]) var thirdplace = await client.users.fetch(users[2].userid); 
                if (users[3]) var fourthplace = await client.users.fetch(users[3].userid);
                if (users[4]) var fifthplace = await client.users.fetch(users[4].userid);
                let leaderboardEmbed = new Discord.MessageEmbed()
                  .setTitle("The Leaderboard")
                  .setColor(client.colors["discord"])
                  .addFields(
                    {name: `First Place ${client.emotes["utility_firstplace"]}`, value: `${firstplace && firstplace.username || 'Nobody Yet'} : ${users[0] && users[0].balance || 'None'} ${client.emotes["currency_vibes"]}`, inline: true},
                    {name: `Second Place ${client.emotes["utility_secondplace"]}`, value: `${secondplace && secondplace.username || 'Nobody Yet'} : ${users[1] && users[1].balance || 'None'} ${client.emotes["currency_vibes"]}`, inline: true},
                    {name: `Third Place ${client.emotes["utility_thirdplace"]}`, value: `${thirdplace && thirdplace.username || 'Nobody Yet'} : ${users[2] && users[2].balance || 'None'} ${client.emotes["currency_vibes"]}`, inline: true},
                    {name: `Fourth Place ${client.emotes["utility_fourthplace"]}`, value: `${fourthplace && fourthplace.username || 'Nobody Yet'} : ${users[3] && users[3].balance || 'None'} ${client.emotes["currency_vibes"]}`, inline: true},
                    {name: `Fifth Place ${client.emotes["utility_fifthplace"]}`, value: `${fifthplace && fifthplace.username || 'Nobody Yet'} : ${users[4] && users[4].balance || 'None'} ${client.emotes["currency_vibes"]}`, inline: true}
                  )
                  .setThumbnail("https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2Fthunder.png?v=1586973726693"); 
                message.channel.send(leaderboardEmbed);

            })
        }
  
} 

module.exports.config = {
  name: "leaderboard",
  aliases: ["top", "baltop", "richest", "vibetop"],
  use: "leaderboard",
  description: "See who is the richest!",
  state : "gamma",
  page: 2
};