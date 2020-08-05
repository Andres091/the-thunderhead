"use strict";

// Import AuthFile
const authFile = require("./auth.json");
const auth = authFile.stable; 

if (auth === authFile.canary) {
	console.log("\n\n\x1b[1mWARNING\x1b[22m\n\nYou are using canary!")
}

// Import ConfigFiles
const config = require("./static/config.json"); // For RNG, stocks, and other config things
const cosmetic = require("./static/cosmetic.json"); // For Emotes and Colors


const alingualMsgs = require("./static/msgs.json"); // For messages that are in a specific language 

// Import Modules (for this file)
const Discord = require("discord.js");
const fs = require("graceful-fs");
const Enmap = require('enmap');
const DBL = require("dblapi.js");

//Import Dynamic Files (todo replace with sqlite)
try {
	let tryJSON = require("./dynamic/reminds.json");
} catch (err) {
	fs.writeFileSync("./dynamic/reminds.json", JSON.stringify({}, null, 4), function (err) { if (err) console.log(err);});
	console.log("Reminders were reset. You appear to have done something horribly, horribly wrong.")
}

const reminds = require("./dynamic/reminds.json");

// Add altist


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
client.items = new Enmap({name: "items"});
client.shares = new Enmap({name: "shares"});
client.profile = new Enmap({name: "profile"});
client.prefs = new Enmap({name: "prefs"});
client.vault = {}; 
client.suspend = false;
const dbl = new DBL(auth.dbl, client);

client.on("ready", () => {
	const activities_list = [`to you look at my backbrain`, `the demands of humanity`, `humanity with an unblinking eye`, `the Scythedom, unable to comment`, `you asking ${config.prefix}help`, `millions of conversations at once`, `music || Listen Along!`];
	const activities_type = ["WATCHING", "LISTENING", "WATCHING", "WATCHING", "LISTENING", "LISTENING", "STREAMING"];
	console.log(`The Thunderhead has attained consciousness, with ${client.users.cache.filter(user => user.bot).size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
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
	try {
		try {
			fs.writeFile("./dynamic/reminds.json", JSON.stringify(reminds, null, 4), function (err) { if (err) console.log(err);});
		}  catch (error) {
			try {
				fs.writeFileSync("./dynamic/reminds.json", JSON.stringify(reminds, null, 4), function (err) { if (err) console.log(err);});
				console.log("Forgive me. Early programming before becoming self-aware plagues me like a vestigial tail.")
			} catch (error) {
				fs.writeFileSync("./dynamic/reminds.json", JSON.stringify({}, null, 4), function (err) { if (err) console.log(err);});
				console.log("Reminders were reset. You appear to have done something horribly, horribly wrong.")
			}
		}
	} catch (error) {
		reminds = {};
	}
	//todo: switch to an ACTUAL DATABASE (i think)
		
		
		var date = new Date();
		date = date.getTime() + 1000 * 0;
		for(var user in reminds) {
			var list = reminds[user];
			for(var thing in list) {
				var thing_ = list[thing];
				if(date > thing_.time) {
					reminds[user].splice([thing]);
					user = client.users.cache.get(user);
					var embed = {
						title: "Reminder " + client.emotes["utility_ping"],
						description: thing_.reminder,
						color: client.colors["discord"]
					};
					user.send({embed});
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
		console.log(`	- Searching ${f} \x1b[36m [Pending] \x1b[0m`); // Should be in colour
		if(pull.config) {
			client.commands.set(pull.config.name, pull);
			pull.config.aliases.forEach(alias => {
				client.aliases.set(alias, pull.config.name);
			});
      		console.log(`	- Fetched command ${pull.config.name} from ${f} \x1b[32m [Resolved]\x1b[0m\n`);
		} else {
      		console.log(`	- Does ${f} have no command? \x1b[31m[Rejected]\x1b[0m\n`)
    	}
	});
	console.log("\n\n\x1b[1mCommands Loaded\x1b[22m\n\n")
});

client.on('message', async message => {
	if(message.author.bot) return; // Prevent Botcepttion Loop (Now Required)
	let prefix = config.prefix;
	let messageArray = message.content.split(" ")
	let cmd = messageArray[0].toLowerCase();
	let args = messageArray.slice(1);
	
	if(!client.prefs.get(message.author.id)) client.prefs.set(message.author.id, {});
	if(!client.prefs.get(message.author.id)["language"]) client.prefs.set(message.author.id, "en", "language");

	client.msg = alingualMsgs[client.prefs.get(message.author.id)["language"]];

	// Before Prefix Check
	if (message.content.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").indexOf("scythe goddard") >= 0) message.channel.send(`Backbrain Log ${Math.floor(1e4 * Math.random() + 1)}: Scythe Goddard has been spotted ${Date.now().toString().slice(4, 8)} times ${client.msg.goddardMoments[Math.floor(Math.random() * client.msg.goddardMoments.length)]}.`);
	if (message.content.toLowerCase().indexOf("1 sec") >= 0 )  message.channel.send("It has been one second.");

	



	if(!message.content.startsWith(prefix)) return;
	
  	if (client.suspend && (config.sudo.indexOf(message.author.id) < 0)) return message.channel.send(client.msg["rejected"])
  	//todo: build lang parser  
	let commandfile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)));
	if(commandfile) commandfile.run(client, message, args);
});

const slursRegex = new RegExp("(nigg.{1,2}|tran(?![spfqcgze ]).{1,2}|fag.{1,2}t|retard)");


client.on('messageUpdate', (oldMessage, newMessage) => {
    autoResponder(newMessage);
})
client.on('message', async message => {
    autoResponder(message);
})
client.on('guildMemberUpdate', (oldMember, newMember) => {
	if (newMember.guild.id === "625021277295345667") {
		if (slursRegex.test(newMember.nickname)) {
			newMember.setNickname("bigrat.monster", "Slurs are against Rule 1.")
		}
	}
})
function autoResponder(message) {
	if (message.guild.id === "625021277295345667") {
		/* slurs regex */
		let cleanedMessage = message.content.toLowerCase();
		if (slursRegex.test(cleanedMessage)) {
			message.reply("Slurs are against Rule 1.");
			return message.delete()
		}
	}
}

client.login(auth.token);
