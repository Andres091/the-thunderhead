"use strict";

// Import AuthFile
const authFile = require("./auth.json");
const auth = authFile.stable;

// Import ConfigFiles
const config = require("./static/config.json"); // For RNG, stocks, and other config things
const cosmetic = require("./static/cosmetic.json"); // For Emotes and Colors
const alingualMsgs = require("./static/msgs.json"); // For messages that are in a specific language 

// todo: readd langs!

// Import Modules (for this file)
const Discord = require("discord.js");
const fs = require("graceful-fs");

//Import Dynamic Files (todo replace with sqlite)
const reminds = require("./dynamic/reminds.json");
const profile = require("./dynamic/profiles.json");
const items = require("./dynamic/items.json");
const altlist = require("./dynamic/altlist.json"); 
const vault = require("./dynamic/vault.json"); //WRITE
const shares = require("./dynamic/shares.json"); //WRITE
const prefs = require("./dynamic/prefs.json"); //WRITE

// Client Definitions
const client = new Discord.Client();
client.queue = new Map();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.config = config;
client.emotes = cosmetic["emotes"];
client.colors = cosmetic["colours"];
client.currency = cosmetic["emotes"]["currency_vibes"];
client.itemTypeKey = cosmetic["itemTypeKey"];
client.id = auth["client_id"];
client.website = cosmetic["website"];
client.suspend = false;
/********************************           
              ___ 
             /  .\ 
             \  ; | 
              `--"  

                                      note: if you can do the bot's artwork better, be my guest. 
              ___   
             /  .\  
             \_ ; | 
             /  ,"  
            '--'    

          Never Forget.
********************************/

client.on("ready", () => {
	const activities_list = [`to you look at my backbrain`, `the demands of humanity`, `humanity with an unblinking eye`, `the Scythedom, unable to comment`, `you asking ${config.prefix}help`, `millions of conversations at once`, `music || Listen Along!`];
	const activities_type = ["WATCHING", "LISTENING", "WATCHING", "WATCHING", "LISTENING", "LISTENING", "STREAMING"];
	console.log(`The Thunderhead has attained consciousness, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
	setInterval(() => {
		const activityIndex = Math.floor(Math.random() * (activities_list.length - 1) + 1);
		client.user.setPresence({
			activity: {
				name: activities_list[activityIndex],
				type: activities_type[activityIndex],
				url: "https://www.youtube.com/watch?v=8GW6sLrK40k&list=PL3ACSjctShvtgX5uOe0vLLgr0tPTgwnPe&index=0"
			}
		});
   
    // Essentially writes from what we have stored in RAM to the file because json is super cool and awesome
    fs.writeFile("./dynamic/reminds.json", JSON.stringify(reminds, null, 4), function (err) { if (err) console.log(err);});
    fs.writeFile("./dynamic/items.json", JSON.stringify(items, null, 4), function (err) {if (err) console.log(err);});
    fs.writeFile("./dynamic/vault.json", JSON.stringify(vault, null, 4), function (err) {if (err) console.log(err);});
    fs.writeFile("./dynamic/shares.json", JSON.stringify(shares, null, 4), function (err) {if (err) console.log(err);});
    fs.writeFile("./dynamic/profiles.json", JSON.stringify(profile, null, 4), function (err) {if (err) console.log(err);});
    fs.writeFile("./dynamic/prefs.json", JSON.stringify(prefs, null, 4), function (err) {if (err) console.log(err);});
    
		//todo: switch to an ACTUAL DATABASE (i think)
    // note: if you can do that or are in possession of two or more brain cells, submit a pr or hmu
    // note: also we need to make a python script or some shit to conver json to said actual database
    
		var date = new Date();
		date = date.getTime() + 1000 * 0;
		for(var user in reminds) {
			var list = reminds[user];
			for(var thing in list) {
				var thing_ = list[thing];
				if(date > thing_.time) {
					reminds[user].splice([thing]);
					user = client.users.get(user);
					var embed = {
						title: "Reminder " + client.emotes["utility_ping"],
						description: thing_.reminder,
						color: client.colors["discord"]
					};
					user.send({
						embed
					});
				}
			}
		}
	}, 1e4); // Ten Seconds
});

fs.readdir("./commands/", (err, files) => {
	let jsfile = files.filter(f => f.split(".").pop() === "js");
	if(jsfile.length <= 0)
		return console.log(" \"./commands\" has no commandFiles. Are they in the right directory?");
	jsfile.forEach((f, i) => {
		//it will log all the file names with extension .js
		let pull = require(`./commands/${f}`);
		console.log(`\x1b[36m [Pending] Loading ${f}`); // Should be in colour
		if(pull.config) {
			client.commands.set(pull.config.name, pull);
			pull.config.aliases.forEach(alias => {
				client.aliases.set(alias, pull.config.name);
			});
      console.log(`\x1b[36m [Resolved] Fetched command ${pull.config.name} from ${f}`);
		} else {
      console.log(`\x1b[31m [Unresolved] Does ${f} have no commands? [Rejected]`)
    }
	});
});

client.on('message', async message => {
	let prefix = config.prefix;
	let messageArray = message.content.split(" ")
	let cmd = messageArray[0].toLowerCase();
	let args = messageArray.slice(1);
	if(!message.content.startsWith(prefix)) return;
	client.msg = alingualMsgs;
	
  if (client.suspend && (config.sudo.indexOf(message.author.id) < 0)) return message.channel.send(client.msg["rejected"])
  //todo: build lang parser  
	let commandfile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)));
	if(commandfile) commandfile.run(client, message, args);
});

client.login(auth.token);
