"use strict";

// Import AuthFile
const authFile = require("./auth.json"); 
const auth = authFile.canary;

// Import ConfigFiles
const config = require("./static/config.json"); // For RNG, stocks, and other config things
const cosmetic = require("./static/cosmetic.json"); // For Emotes and Colors
const alingualMsgs = require("./static/msgs.json"); // For messages that are in a specific language


// Import Modules
const Discord = require("discord.js");
const fs = require("graceful-fs");

//Import Dynamic Files (todo replace with sqlite)
const reminds = require("./dynamic/reminds.json");
const profile = require("./dynamic/profiles.json");

// Client Definitions
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases =  new Discord.Collection();
client.config = config;
client.emotes = cosmetic["emotes"];
client.colors = cosmetic["colours"];
client.currency = cosmetic["emotes"]["currency_vibes"];
client.itemTypeKey = cosmetic["itemTypeKey"];
client.id = auth["client_id"];
client.website = cosmetic["website"];
/********************************           
              ___ 
             /  .\ 
             \  ; | 
              `--"  


              ___   
             /  .\  
             \_ ; | 
             /  ,"  
            '--'    

          Never Forget.
          Skrub - 2020
********************************/

client.on("ready", () => {
  console.log("Cirrus is ready to guide you through the stars!")
  
  const activities_list = [`to you look at my backbrain`, `the demands of humanity`, `humanity with an unblinking eye`, `the Scythedom, unable to comment`, `you saying ${config.prefix}help`, `millions of convesations at once`];
  const activities_type = ["WATCHING", "LISTENING", "WATCHING", "WATCHING", "LISTENING", "LISTENING"];
  
  console.log(`The Thunderhead has attained consciousness, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
  setInterval(() => {
        const activityIndex = Math.floor(Math.random() * (activities_list.length - 1) + 1);
        client.user.setPresence({
            game: {
                name: activities_list[activityIndex],
                type: activities_type[activityIndex],
                url: "https://the-thunderhead.glitch.me" // todo: make twitch account
            }
        });

  fs.writeFile("./dynamic/reminds.json", JSON.stringify(reminds, null, 4), function (err) { if (err) console.log(err);});
  fs.writeFile("./dynamic/profiles.json", JSON.stringify(profile, null, 4), function (err) { if (err) console.log(err);});
    
  // Essentially writes from what we have stored in RAM to the file because json is super cool and awesome
  var date = new Date();
  date = date.getTime() + 1000 * 0;
  for (var user in reminds) {
    var list = reminds[user];
      for (var thing in list) {
        var thing_ = list[thing];
        if (date > thing_.time) {
            reminds[user].splice([thing]);
            user = client.users.get(user);
            var embed = {
                title: "Reminder " + client.emotes["utility_ping"],
                description: thing_.reminder,
                color: client.colors["discord"]
            };
            user.send({ embed });
        }
      }
    }

      }, 1e4); // Ten Seconds
});

fs.readdir("./commands/", (err, files) => {
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if (jsfile.length <= 0)
    return console.log(" \"./commands\" has no commandFiles. Are they in the right directory?");
  jsfile.forEach((f, i) => {
    //it will log all the file names with extension .js
    console.log(`Succesfully loaded ${f}`);

    let pull = require(`./commands/${f}`);

    client.commands.set(pull.config.name, pull);
    pull.config.aliases.forEach(alias => {
      client.aliases.set(alias, pull.config.name);
    });
  });
});


client.on('message', async message => {
    let prefix = config.prefix;
    
    let messageArray = message.content.split(" ")
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);
  
    if(!message.content.startsWith(prefix)) return;
    
    client.msg = alingualMsgs;
    //todo: build lang parser  
  
    let commandfile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)));
    if(commandfile) commandfile.run(client,message,args);   
        
});

client.login(auth.token);