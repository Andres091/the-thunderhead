"use strict";
//Imports
const Discord = require('discord.js');
const fs = require('graceful-fs');
const msmute = require('ms');
const request = require('request');
const mexp = require('math-expression-evaluator');
const Canvas = require('canvas');
var eco = require('discord-economy');
const catFacts = require('cat-facts');
const alpha = require('alphavantage')({ key: `thunder${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}` });
const wiki = require('wikijs').default;
var cats = require("cat-ascii-faces");
var weather = require("weather-js");
const ytdl = require("ytdl-core"),
    ytpl = require("ytpl"),
    ytsearch = require("yt-search"),
    { Util } = require("discord.js");
const http = require("http");
const express = require("express");
var bodyParser = require("body-parser");
const DBL = require("dblapi.js");
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(3000);
//JSON
const helpList = require("./static/help.json"); //READ ONLY
const global_msgs = require("./static/msgs.json"); //READ ONLY
const reminds = require("./dynamic/reminds.json"); //WRITE
const events = require("./dynamic/events.json"); //WRITE
const items = require("./dynamic/items.json"); //WRITE
const vault = require("./dynamic/vault.json"); //WRITE
const shares = require("./dynamic/shares.json"); //WRITE
const prefs = require("./dynamic/prefs.json"); //WRITE
const profile = require("./dynamic/profiles.json"); //WRITE
const altlist = require("./dynamic/altlist.json"); //WRITE
const authFile = require("./auth.json"); // READ ONLY AUTH
const auth = authFile.stable;

app.get("/items.json", function (request, response) { response.send(items); });
app.get("/server.js", function (request, response) { response.sendFile(__dirname + "/server.js"); });
app.get("/prefs.json", function (request, response) { response.send(prefs); });
app.get("/help.json", function (request, response) { response.send(helpList); });
app.get("/msgs.json", function (request, response) { response.send(global_msgs); });
app.get("/", function (request, response) { response.send(`<meta http-equiv="refresh" content="0; url=https://hyperskrub.glitch.me" />`); });

app.get("/", (request, response) => {
    console.log(Date.now() + " Ping Received");
    response.sendStatus(200);
});

//Functions
function clean(text) {
    if (typeof text === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else return text;
}

//Fonts
//registerFont('Quicksand-Medium.ttf', { family: 'Quicksand' })


//Definitions
const prefix = "/";
const devPrefix = "d/";
const developerId = "297096161842429963";
const currency = "<:vibes:699395024886038628>";
const client = new Discord.Client();
const dbl = new DBL(auth.dblapi_token, client);
client.commands = new Discord.Collection();
const queue = new Map();
const workedRecently = new Set(); //This should be around five minutes
var botception = false;
var botSuspend = false;
//Objects(s) too short to warrant separate file (4)
const itemTypeKey = {
    "dev": {
        "name": "Developer ",
        "emoji": "☕"
    },
    "general": {
        "name": "",
        "emoji": "📜"
    },
    "eco": {
        "name": "Economy ",
        "emoji": currency
    },
    "music": {
        "name": "Music ",
        "emoji": "🎵"
    },
    "mod": {
        "name": "Moderation & Utility ",
        "emoji": "🔧"
    }
};
const colors = {
    "discord": "36393E", //discord darkmode background colour
    "gamble_even": "88b5ba", //Light Grey Cyan-esque
    "gamble_green": "2ebf50", // green
    "gamble_red": "ff3333", //red
    "music": "482f95", //purple
    "thunder": "8f78ff" //magenta
};
const activities_list = [`to you look at my backbrain`, `the demands of humanity`, `humanity with an unblinking eye`, `the Scythedom, unable to comment`, `you saying ${prefix}help`, `online`, `millions of convesations at once`];
const activities_type = ["WATCHING", "LISTENING", "WATCHING", "WATCHING", "LISTENING", "STREAMING", "LISTENING"];
//Reminds & Activities
client.on("ready", () => {
    console.log(`The Thunderhead has attained consciousness, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`), setInterval(() => {
        const a = Math.floor(Math.random() * (activities_list.length - 1) + 1);
        client.user.setPresence({
            game: {
                name: activities_list[a],
                type: activities_type[a],
                url: "https://the-thunderhead.glitch.me"
            }
        });


        // Essentially writes from what we have stored in RAM to the file because json is super cool and awesome
        fs.writeFile("./dynamic/reminds.json", JSON.stringify(reminds, null, 4), function (err) { if (err) console.log(err);});
        fs.writeFile("./dynamic/events.json", JSON.stringify(events, null, 4), function (err) {if (err) console.log(err);});
        fs.writeFile("./dynamic/items.json", JSON.stringify(items, null, 4), function (err) {if (err) console.log(err);});
        fs.writeFile("./dynamic/vault.json", JSON.stringify(vault, null, 4), function (err) {if (err) console.log(err);});
        fs.writeFile("./dynamic/shares.json", JSON.stringify(shares, null, 4), function (err) {if (err) console.log(err);});
        fs.writeFile("./dynamic/profiles.json", JSON.stringify(profile, null, 4), function (err) {if (err) console.log(err);});
        fs.writeFile("./dynamic/prefs.json", JSON.stringify(prefs, null, 4), function (err) {if (err) console.log(err);});

        var b = new Date;
        for (var c in b = b.getTime() + 0, reminds) {
            var d = reminds[c];
            for (var e in d) {
                var f = d[e];
                if (b > f.time) {
                    reminds[c].splice([e]), c = client.users.get(c);
                    var g = {
                        title: "Reminder <:ping:652636924934225920>",
                        description: f.reminder,
                        color: 3553598
                    };
                    c.send({
                        embed: g
                    })
                }
            }
        }
        var h = new Date;
        for (var i in h = h.getTime() + 0, events) {
            var d = events[i];
            for (var e in d) {
                var f = d[e];
                if (h > f.time) {
                    events[i].splice([e]), i = client.channels.get(i);
                    const a = f.reminder.trim().split(/ +/g);
                    var j;
                    j || (j = "https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2Fcirrus.png");
                    var g = {
                        title: a[0],
                        description: f.reminder.split(" ").slice(1).join(" "),
                        color: 3553598,
                        thumbnail: {
                            url: j
                        }
                    };
                    i.send({
                        embed: g
                    })
                }
            }
        }
    }, 1e4)
}),
    // Guilds-In Updates
    client.on("guildCreate", a => {
        const b = client.channels.get("643137323290066954");
        b.send(`New guild joined: ${a.name} (id: ${a.id}). This guild has ${a.memberCount} members!`), client.user.setActivity(`Serving ${client.guilds.size} servers`)
    }),
    client.on("guildDelete", a => {
        const b = client.channels.get("643137323290066954");
        b.send(`I have been removed from: ${a.name} (id: ${a.id})`), client.user.setActivity(`Serving ${client.guilds.size} servers`)
    });


//Command System
client.on("message", async message => {

    if (message.author.bot && !botception) return; //if botception is on
    if (!message.guild) return;
    if (message.guild.id === "625021277295345667") {
        var myItems = items[message.author.id];
        var count = -1;
        for (var item in myItems) {
            count++;
            item = myItems[item];
            if (item.type === "Robe") {
                if (!item.robecolor) return;
                let roleName = item.robecolor.charAt(0).toUpperCase() + item.robecolor.slice(1).toLowerCase() + " Robe"
                var rl = message.guild.roles.find(role => role.name === roleName);
                if (!rl) rl = message.guild.roles.find(role => role.name === roleName.replace("Robe", "Frock"));
                message.member.addRole(rl);
            }
        }
    }
    try {
        if (message.member.roles.find(role => role.name === "Unsavory")) return message.delete();
    } catch (error) {
        console.log(error);
    }

    if (!prefs[message.author.id]) prefs[message.author.id] = "en"
    if (!global_msgs[prefs[message.author.id]]) prefs[message.author.id] = "en"
    let lang = prefs[message.author.id]
    const msg = global_msgs[lang]

    
    // Before Prefix Check
    0 <= message.content.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").indexOf("scythe goddard") && message.channel.send(`Backbrain Log ${Math.floor(1e4 * Math.random() + 1)}: Scythe Goddard has been spotted ${Date.now().toString().slice(4, 8)} times ${msg.goddardMoments[Math.floor(Math.random() * msg.goddardMoments.length)]}.`);
    0 <= message.content.toLowerCase().indexOf("1 sec") && message.channel.send("It has been one second.");


    if (message.mentions.users.has("629799045954797609")) {
        var mentionedEmbed = new Discord.RichEmbed().setColor(colors.thunder)
            .setTitle(msg.greetings)
            .setDescription((msg.greetings_desc).replace("[AUTHOR]", message.author.username).replace("[SITE]", msg.site_site).replace("[PREFIX]", prefix))
            .setFooter("", message.mentions.users.first().displayAvatarURL);
        message.channel.send(mentionedEmbed)
    }
    if (message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (botSuspend == true && message.author.id !== developerId) return message.channel.send(msg.maintenance); // if suspend is on
    if (command === "help") {
        const helpMessages = [];
        var index = -1,
            prepend = devPrefix;
        for (var itemType in helpList) {
            index++ , 0 !== index && (prepend = prefix);
            var helpMessage = itemTypeKey[itemType].emoji + " __" + itemTypeKey[itemType].name + "Commands__ (Page " + index + "/" + (Object.keys(helpList).length - 1) + ")\n";
            for (var item in helpList[itemType]) helpMessage = helpMessage + "`" + prepend + helpList[itemType][item].name + "`: " + helpList[itemType][item].desc.replace("[PREFIX]", prefix) + "\n";
            helpMessages.push(helpMessage)
        }
        var page = args[0];
        page || (page = 1);
        var helpText = helpMessages[page];
        if (!helpText) {
            var commandData = {},
                commandTypeIndex = 0;
            for (var itemType in helpList) {
                if (0 < commandTypeIndex)
                    for (item in helpList[itemType]) helpList[itemType][item].name === args[0] && (commandData = helpList[itemType][item]);
                commandTypeIndex++
            }
            helpText = "__**Command:** *" + commandData.name + "*__\nInfo: " + commandData.desc + "\nUse: `" + prefix + commandData.use + "`", "beta" === commandData.state && (helpText += msg.help_beta),
                "delta" === commandData.state && (helpText += msg.help_delta), helpText &&
                commandData.name || (helpText = msg.help_nocommand)
        }
        message.channel.send(helpText);
    }
    if (command === "ping") {
        const m = await message.channel.send(msg.ping_ping);
        m.edit(msg.ping_pong);
    }
    if ((command === "remindme") || (command === "remind") || (command == "r")) {
        if (!(reminds[message.author.id])) {
            reminds[message.author.id] = []
        }
        var date = new Date();
        var time = args[0]
        if (!time) return message.reply(msg.remind_notime);
        if (!time.match(/[s,m,h,d,w,y]/g)) return message.reply(msg.remind_novalidtime);
        if (!(args[1])) return message.channel.send(msg.remind_noreminder);
        var themessage = message.content.split(" ").slice(2).join(" ");
        var strunit = time.slice(-1);
        var unit = 1
        if (strunit === "s") {
            unit = 1
        }
        if (strunit === "m") {
            unit = 60
        }
        if (strunit === "h") {
            unit = 3600
        }
        if (strunit === "d") {
            unit = 86400
        }
        if (strunit === "w") {
            unit = 604800
        }
        if (strunit === "y") {
            unit = 31557600
        }
        time = (time.slice(0, -1))
        var inted = parseInt(time);
        var newtime = new Date();
        newtime = (date.getTime() + (unit * 1000 * time))
        date = date.getTime() + (unit * 0)
        reminds[message.author.id].push({
            "reminder": themessage,
            "time": newtime
        })
        message.channel.send(msg.remind_success)
    }
    if (command === "randomchimpevent") {
        message.channel.send("https://imgur.com/CwQRLGK")
    }
    if (command === "userinfo") {
        if (!args[0]) return message.channel.send(msg.userinfo_nomention)
        let user = client.users.get(args[0].replace(/[@!<>]/g, ""));
        if (!user) return message.channel.send(msg.userinfo_nomention);
        var userBalance = await eco.FetchBalance(user.id);
        userBalance = userBalance.balance;

        let joinedServerDate = "n/a"
        let nicknameServer = "n/a"

        const joinDate = user.createdAt.getDate() + 1 + "-" + (user.createdAt.getMonth() + 1) + "-" + user.createdAt.getFullYear() + " @ " + user.createdAt.getHours() + ":" + user.createdAt.getMinutes() +
            ":" + user.createdAt.getSeconds();
        if (message.guild.member(user)) joinedServerDate = message.guild.member(user).joinedAt.getDate() + 1 + "-" + (message.guild.member(user).joinedAt.getMonth() + 1) + "-" + message.guild.member(user).joinedAt.getFullYear() +
            " @ " + message.guild.member(user).joinedAt.getHours() + ":" + message.guild.member(user).joinedAt.getMinutes() + ":" + message.guild.member(user).joinedAt.getSeconds();
        let game = user.presence.game;
        if (message.guild.member(user)) nicknameServer = message.guild.member(user).nickname;
        let status;
        let statusColor;
        if (user.presence.status === "online") status = "<:online:703296745228075078> Online";
        if (user.presence.status === "online") statusColor = 0x00aa4c;
        if (user.presence.status === "idle") status = "<:idle:703296744858845224> Idle";
        if (user.presence.status === "idle") statusColor = 0xf7c035;
        if (user.presence.status === "dnd") status = "<:dnd:703296744389345351> Do Not Disturb";
        if (user.presence.status === "dnd") statusColor = 0x9c0000;
        if (user.presence.status === "offline") status = "<:offline:703296745081405560> Offline";
        if (user.presence.status === "offline") statusColor = 0x000000;
        if (user.presence.game)
            if (user.presence.game.streaming) {
                status = "<:stream:703296745073016862> Streaming"
                statusColor = 0x6711039;
            }
        let emoji;
        let song;
        let thumbnail;
        if (game) {
            if (game.emoji)
                if (!game.emoji.id) {
                    emoji = game.emoji.name
                }
                else {
                    emoji = `<:${game.emoji.name}:${game.emoji.id}>`;
                }
            if (game.name === "Spotify") song = `Listening to ${game.assets.largeText} by ${game.state} 💿${game.details}`;
            if (game.assets) {
                thumbnail = `${game.assets.largeImage}`.replace("spotify:", "https://i.scdn.co/image/");
                if (thumbnail.startsWith("https://")) return;
                thumbnail = `https://cdn.discordapp.com/app-assets/${game.applicationID}/${game.assets.largeImage}.png`
            }
        }
        let activities = ["Playing",
            "Streaming",
            "Listening to",
            "Watching",
            "Custom Status"]
        let activity = "Activity";
        if (game) activity = activities[game.type];
        if (game) game = ((game).toString()).replace("Custom Status", ((emoji || "") + (game.state))).replace("Spotify", song || "Spotify").replace("null", msg.userinfo_notplaying);
        if (!game) game = "Nothing";
        if (!nicknameServer) nicknameServer = user.username;
        message.channel.send({
            embed: {
                color: statusColor,
                author: {
                    name: `${user.username}'s Userinfo`,
                    icon_url: user.displayAvatarURL
                },
                fields: [{
                    name: "**User Info:**",
                    value: `<@!${user.id}>\n**Joined Discord:** ${joinDate}\n**Joined Server** ${joinedServerDate}\n**Nickname:** ${nicknameServer}\n**${activity}:** ${game}\n**Profile:** ${status}`
                },
                {
                    name: "Discord Info:",
                    value: `**Tag:** ${user.discriminator}\n**User ID:** ${user.id}\n**Username:**  ${user.username}${((user.bot).toString()).replace("false", "").replace("true", "<:bot:703299323927986246>")}`
                },
                {
                    name: "Balance",
                    value: `${userBalance} ${currency}`
                }],
                timestamp: new Date(),
                "thumbnail": {
                    "url": thumbnail
                },
                footer: {
                    icon_url: client.user.avatarURL,
                    text: "Thunderhead Backbrain"
                }
            }
        });
    }
    if (command === "serverinfo") {
        function checkDays(date) {
            let now = new Date();
            let lapsed = now.getTime() - date.getTime();
            let days = Math.floor(lapsed / 86400000);
            return days + (days == 1 ? " day" : " days") + " ago";
        };
        let discordGuildVerificationLevels = ["None", "Low", "Medium", "(╯°□°）╯︵  ┻━┻", "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"];
        let region = { // These are the flags, they work on discord but the emoji don't render on PC.
            "brazil": "🇧🇷 Brazil",
            "eu-central": "🇪🇺 Central Europe",
            "singapore": "🇸🇬 Singapore",
            "us-central": "🇺🇸 U.S. Central",
            "sydney": "🇦🇺 Sydney",
            "us-east": "🇺🇸 U.S. East",
            "us-south": "🇺🇸 U.S. South",
            "us-west": "🇺🇸: U.S. West",
            "eu-west": "🇪🇺: Western Europe",
            "vip-us-east": "🇺🇸 VIP U.S. East",
            "london": "🇬🇧 London",
            "amsterdam": "🇳🇱 Amsterdam",
            "hongkong": "🇭🇰 Hong Kong",
            "russia": "🇷🇺 Russia",
            "southafrica": "🇿🇦 South Africa"
        };
        const embed = new Discord.RichEmbed().setAuthor(message.guild.name, message.guild.iconURL).addField("Name", message.guild.name, true).addField("ID", message.guild.id, true).addField("Owner",
            `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`, true).addField("Region", region[message.guild.region], true).addField("Total | Humans | Bots",
                `${message.guild.members.size} | ${message.guild.members.filter(member => !member.user.bot).size} | ${message.guild.members.filter(member => member.user.bot).size}`, true).addField(
                    "Verification Level", discordGuildVerificationLevels[message.guild.verificationLevel], true).addField("Channels", message.guild.channels.size, true).addField("Roles", message.guild.roles.size,
                        true).addField("Creation Date", `${message.channel.guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(message.channel.guild.createdAt)})`, true).setColor(colors.discord).setThumbnail(
                            message.guild.iconURL)
        message.channel.send({
            embed
        });
    }
    if (command === "weather") {
        if (!args[0]) return message.channel.send(msg.weather_nolocation);
        await weather.find({
            search: args.join(" "),
            degreeType: "F"
        }, function (err, result) {
            if (!result) {
                message.channel.send(msg.weather_nolocation);
                return;
            }
            if (!result[0]) return message.channel.send((msg.weather_notfastenough).replace("[JOINARGS]", args.join(" ")))
            var current = result[0].current;
            var location = result[0].location;
            var WeatherEmbed = new Discord.RichEmbed().setDescription(`**${current.skytext}**`).setAuthor(`Weather for ${current.observationpoint}`).setThumbnail(current.imageUrl).setColor(colors.discord)
                .addField("Timezone ", `UTC ${location.timezone}`, true).addField("Degree Type ", location.degreetype, true).addField("Temperature ", `${current.temperature} Degrees`, true).addField(
                    "Feels Like ", `${current.feelslike} Degrees`, true).addField("Winds ", current.winddisplay, true).addField("Humidity ", `${current.humidity}%`, true);
            message.channel.send(WeatherEmbed);
        });
    }
    if (command === "tpose") return message.channel.send(`${message.author.username} has asserted their dominance`)
    if (command === "time") {
        if (!args[0]) return message.channel.send(msg.weather_nolocation); // Its for time but it still works
        await weather.find({
            search: args.join(" "),
            degreeType: "F"
        }, function (err, result) {
            if (!result) {
                message.channel.send(msg.weather_nolocation);
                return;
            }
            var utcDate = Date.now();
            if (!result[0]) return message.channel.send((msg.time_notfastenough).replace("[JOINARGS]", args.join(" ")))
            var date = new Date(utcDate + (result[0].location.timezone * 60 * 60 * 1000));
            var days = msg.time_days;
            var years = msg.time_years // Confirmed Scythe Cannon that They Used Chinese Calden and just added an animal each year
            message.channel.send(`__${result[0].location.name}__:\n ${days[date.getDay()]} @ ${date.getHours()}:${date.getMinutes()}\n${years[date.getFullYear() - 2020]} || (${date.getFullYear()})`)
        });
    }
    if ((command === "event") || (command === "newevent") || (command === "createevent") || (command == "e")) {
        if (!(events[message.channel.id])) {
            events[message.channel.id] = []
        }
        var date = new Date();
        var time = args[0]
        if (!time) return message.reply(msg.event_notime);
        if (!time.match(/[s,m,h,d,w,y]/g)) return message.reply(msg.event_novalidtime);
        if (!(args[1])) return message.channel.send(msg.event_noevent);
        var themessage = message.content.split(" ").slice(2).join(" ");
        var strunit = time.slice(-1);
        var unit = 1
        if (strunit === "s") unit = 1;
        if (strunit === "m") unit = 60;
        if (strunit === "h") unit = 3600;
        if (strunit === "d") unit = 86400;
        if (strunit === "w") unit = 604800;
        if (strunit === "y") unit = 31557600;
        time = (time.slice(0, -1))
        var inted = parseInt(time);
        var newtime = new Date();
        newtime = (date.getTime() + (unit * 1000 * time))
        date = date.getTime() + (unit * 0)
        events[message.channel.id].push({
            "reminder": themessage,
            "time": newtime
        })
        message.channel.send(msg.event_success)
    }
    if (command === "site") {
        message.channel.send(msg.site_site)
    }
    if (command === "roleme" || command === "role" || command === "roles" || command === "iam") {
        if (message.guild.id !== "625021277295345667") return message.channel.send(msg.roleme_not_supported);
        var role = args[0];
        if (!role) return message.channel.send(msg.role_blurb);
        var _r = role.toLowerCase().charAt(0).toUpperCase() + role.toLowerCase().slice(1);
        if (_r === "Artist" || _r === "Writer" || _r === "Scythe" || _r === "Spoiled" || _r === "Tonist" || _r === "Minecraft") {
            var rl = message.guild.roles.find('name', _r);
            if (message.member.roles.find(r => r.name === _r)) {
                message.member.removeRole(rl);
                message.channel.send(`The ${_r} role was unassigned.`);
            } else {
                message.member.addRole(rl);
                message.channel.send(`The ${_r} role was assigned.`);
            }
        }
        if (_r === "Unsavory") {
            if (Math.random > .988) {
                message.member.addRole(message.guild.roles.find('name', "Unsavory"));
                message.channel.send("Yes.")
            } else {
                message.channel.send("No.")
            }
        }
    }
    if (command === "cat") {
        message.channel.send(cats() + "\n" + catFacts.random());
    }
    if (command === "f") {
        var FEmbed = new Discord.RichEmbed().setColor(colors["thunder"]).setDescription(`**f**🥀  ${message.author.username} has paid their respects.`);
        // GUT THIS COMMAND SILENTLY AT FIRST CHANCE
        message.channel.send(FEmbed);
    }
    if (command === "wiki") {
        try {
            let page = await wiki().page(args.join(" "));
            let summary = await page.summary();
            let image = await page.mainImage();

            let WikiEmbed = new Discord.RichEmbed()
                .setTitle(page.raw.title)
                .setDescription((summary.match(/.{1,2048}/g))[0])
                .setImage(image)
            message.channel.send(WikiEmbed);
        } catch (err) {
            message.channel.send(err);
        }

    }

    if (command === "profile") {
        if (!profile) profile = {};
        let target = message.author.id;
        if (args[0]) if (client.users.get(args[0].replace(/[@!<>]/g, ""))) target = args[0].replace(/[@!<>]/g, "");

        if (!profile[target]) {
            profile[target] = {};
            message.channel.send(msg.profile_setup);
        }

        if (!profile[target]["skin"]) profile[target]["skin"] = "skin_olive";
        if (!profile[target]["face"]) profile[target]["face"] = "face_brown_default";
        if (!profile[target]["robe"]) profile[target]["robe"] = "robe_red";
        if (!profile[target]["gem"]) profile[target]["gem"] = "gem_none";
        if (!profile[target]["backdrop"]) profile[target]["backdrop"] = "backdrop_none";




        if (!args[0] || target != message.author.id) {
            const canvas = Canvas.createCanvas(512, 512);
            const ctx = canvas.getContext('2d');
            const background = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${profile[target]["backdrop"]}.png?v=latest`);
            const darkener = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2Fdarkener.png`);
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(darkener, 0, 0, canvas.width, canvas.height);

            if (target != "629799045954797609" && target != "704354866671124545") {
                const skin = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${profile[target]["skin"]}.png?v=latest`);
                const face = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${profile[target]["face"]}.png?v=latest`);
                const robe = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${profile[target]["robe"]}.png?v=latest`);
                const gem = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${profile[target]["gem"]}.png?v=latest`);
                ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                ctx.drawImage(face, 0, 0, canvas.width, canvas.height);
                ctx.drawImage(robe, 0, 0, canvas.width, canvas.height);
                ctx.drawImage(gem, 0, 0, canvas.width, canvas.height);
            } else {
                const bot = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F512${target}.png?v=latest`);
                ctx.drawImage(bot, 0, 0, canvas.width, canvas.height);
            }


            const attachment = new Discord.Attachment(canvas.toBuffer(), 'scythe-avatar.png');

            message.channel.send(`Profile:`, attachment);
        } else {
            let toEdit = args[0].toLowerCase();
            let typeOf = args[1];

            // Face is split into two types: color and expression
            if (toEdit === "skin" || toEdit === "skincolor" || toEdit === "race") {
                if (!typeOf) return message.channel.send(msg.profile_nvalidskin);
                typeOf = typeOf.toLowerCase().replace("pale", "white");
                if (typeOf === "white" || typeOf === "olive" || typeOf === "tan" || typeOf === "brown") {
                    profile[target]["skin"] = `skin_${typeOf}`;
                    message.channel.send(msg.profile_skinset);
                } else return message.channel.send(msg.profile_nvalidskin);

            } else if (toEdit === "robe" || toEdit === "frock" || toEdit === "clothing") {
                if (!typeOf) return message.channel.send(msg.profile_nvalidrobe);
                typeOf = typeOf.toLowerCase();
                if (typeOf === "red" || typeOf === "orange" || typeOf === "yellow" || typeOf === "lime" || typeOf === "green" || typeOf === "turquoise" ||
                    typeOf === "blue" || typeOf === "lavender" || typeOf === "purple" || typeOf === "tonist" || typeOf === "black" || typeOf === "white") {
                    profile[target]["robe"] = `robe_${typeOf}`;
                    message.channel.send(msg.profile_robeset);
                } else return message.channel.send(msg.profile_nvalidrobe);

            } else if (toEdit === "gem" || toEdit === "gems" || toEdit === "jewels") {
                if (!typeOf) return message.channel.send(msg.profile_nvalidgem);
                typeOf = typeOf.toLowerCase();
                if (typeOf == "blue" || typeOf == "green" || typeOf == "purple" || typeOf == "red" || typeOf == "white" || typeOf == "yellow") {
                    profile[target]["gem"] = `gem_${typeOf}`;
                } else profile[target]["gem"] = `gem_none`;
                message.channel.send(msg.profile_gemset);

            } else if (toEdit === "expression" || toEdit === "emotion" || toEdit === "face") {
                if (!typeOf) return message.channel.send(msg.profile_nvalidface);
                typeOf = typeOf.toLowerCase().replace("angry", "anger").replace("blushing", "blush").replace("normal", "default");
                if (typeOf === "anger" || typeOf === "blush" || typeOf === "serious" || typeOf === "default") {
                    let faceArgs = (profile[target]["face"]).split("_");
                    faceArgs[2] = typeOf;
                    profile[target]["face"] = faceArgs.join("_");
                    message.channel.send(msg.profile_faceset)
                } else return message.channel.send(msg.profile_nvalidface);

            } else if (toEdit === "hair" || toEdit === "hairs" || toEdit === "head") {
                if (!typeOf) return message.channel.send(msg.profile_nvalidhair);
                typeOf = typeOf.toLowerCase();
                if (typeOf === "black" || typeOf === "brown" || typeOf === "green" || typeOf === "red" || typeOf === "white" || typeOf === "yellow") {
                    let faceArgs = (profile[target]["face"]).split("_");
                    faceArgs[1] = typeOf;
                    profile[target]["face"] = faceArgs.join("_");
                    message.channel.send(msg.profile_hairset)
                } else return message.channel.send(msg.profile_nvalidhair);

            } else if (toEdit === "backdrop" || toEdit === "background" || toEdit === "enviroment") {
                if (!typeOf) return message.channel.send(msg.profile_nvalidbackdrop);
                typeOf = typeOf.toLowerCase();
                if (typeOf == "red" || typeOf == "green" || typeOf == "turquoise" || typeOf == "dream" || typeOf == "incorrect" || typeOf == "correct") {
                    profile[target]["backdrop"] = `backdrop_${typeOf}`;
                } else profile[target]["backdrop"] = `backdrop_none`;
                message.channel.send(msg.profile_backdropset);

            } else return message.channel.send(msg.profile_invalid);

        }


    }

    if (command === "ask") {
        let expVal;
        let maybeViolate = message.content;
        try {
            expVal = (mexp.eval(args.join(" ").replace(/sqrt/g, 'root').replace(/[÷]/g, "/").replace(/[xX]/g, "*").replace(/[`]/g, ""))).toString();
        } catch (err) { }
        if (0 <= maybeViolate.toLowerCase().indexOf("scythe") || 0 <= maybeViolate.toLowerCase().indexOf("$cythe")) {
            message.channel.send(`You asked: *${args.join(" ")}*`, {
                files: [msg.ask_warn]
            });
        } else if (expVal) {
            const canvas = Canvas.createCanvas(600, 600);
            const ctx = canvas.getContext('2d');
            const background = await Canvas.loadImage('https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2Fyes600x600.png');
            await ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            ctx.font = '80px sans-serif';
            ctx.fillStyle = '#f3f0cd';
            ctx.textAlign = 'center'
            ctx.fillText((Math.round(expVal * 1000) / 1000), canvas.width / 2, canvas.height / 2.2);
            message.channel.send(`Expression: \`${args.join(" ").replace(/root/g, 'sqrt').replace(/[/]/g, "÷").replace(/[*]/g, "x")}\``, {
                files: [canvas.toBuffer()]
            });
        } else {
            var scytheRandom = Math.floor(Math.random() * msg.ask_answers.length);
            message.channel.send(`You asked: *${args.join(" ")}*`, {
                files: [msg.ask_answers[scytheRandom]]
            });
        }
    }
    if (command === "bal" || command === "balance" || command === "vibecheck") {
        var userToCheck = message.mentions.members.first();
        userToCheck = userToCheck ? userToCheck.user : message.author;
        var output = await eco.FetchBalance(userToCheck.id);
        balText = `Balance: ${output.balance}`;

        let font = "Calibri"
        if (!profile[userToCheck.id]) {
            profile[userToCheck.id] = {};
            message.channel.send(msg.profile_setup);

        }
        if (!profile[userToCheck.id]["backdrop"]) profile[userToCheck.id]["backdrop"] = "backdrop_none";
        const canvas = Canvas.createCanvas(400, 160);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${profile[userToCheck.id]["backdrop"]}.png?v=latest`);
        const darkener = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2Fdarkener.png`);
        const currencyIcon = await Canvas.loadImage(`https://cdn.discordapp.com/emojis/${currency.split(":")[2].split(">")[0]}.png`);
        await ctx.drawImage(background, 0, 0, 400, 160);
        await ctx.drawImage(darkener, 0, 0, 400, 160);
        ctx.font = `15px ${font}`;
        ctx.fillStyle = '#ffffff';
        ctx.fillText((userToCheck.username), canvas.width / 4.2, canvas.height / 2.5);
        ctx.font = `30px ${font}`;
        ctx.fillText((balText), canvas.width / 4.2, canvas.height / 1.7);
        ctx.drawImage(currencyIcon, 310, 72, canvas.height / 6, canvas.height / 6);
        ctx.beginPath();
        ctx.arc(50, 75, canvas.height / 5.5, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        const avatar = await Canvas.loadImage(userToCheck.displayAvatarURL);
        ctx.drawImage(avatar, 20, 40, canvas.height / 2.5, canvas.height / 2.5);
        const attachment = new Discord.Attachment(canvas.toBuffer(), 'balance.png');
        message.channel.send(attachment);
    }
    if (command === "roll") {
        var output = await eco.FetchBalance(message.author.id)
        var balance = output.balance;
        if (!args[0]) return message.channel.send(msg.roll_amt);
        var stake = args[0];
        if (isNaN(stake)) return message.channel.send(msg.roll_validint);
        if (stake < 1 || stake > balance) return message.channel.send(msg.roll_namt);
        var staticStake = stake;
        var profitFactor = Math.floor((Math.random() * 6) + 1) - 4;
        var profitWord = "/";
        var gambleEndColor = colors.gamble_even;
        if (0 < profitFactor) {
            // positive value
            profitWord = "+";
            stake = stake * profitFactor;
            gambleEndColor = colors.gamble_green;
        } else if (profitFactor < 0) {
            // negative value
            profitWord = "-";
            stake = stake * -1;
            gambleEndColor = colors.gamble_red;
        } else {
            stake = 0;
        }
        var rollEmbed = new Discord.RichEmbed().setTitle(message.author.username).addField(`${profitWord} ${Math.abs(stake)} ${currency}`, `Balance: **${parseInt(balance) + parseInt(stake)}**`).setFooter(`${message.author.username} 's account.`, message.author.displayAvatarURL).setColor(gambleEndColor);
        message.channel.send(rollEmbed)



        const channel = client.channels.get(msg.ecologid);
        if (message.guild.id != "625021277295345667") channel.send(rollEmbed)
        output = await eco.AddToBalance(message.author.id, stake)
    }
    if (command === "pay") {
        var user = message.mentions.users.first();
        var amount = args[1];
        if (!user) return message.reply(msg.pay_nouser);
        if (!amount) return message.reply(msg.pay_amt);
        var output = await eco.FetchBalance(message.author.id);
        if (output.balance < amount || amount != amount || amount < 1) return message.reply(msg.pay_namt);
        if (user.id === message.author.id) return message.channel.send(msg.pay_noself)
        var transfer = await eco.Transfer(message.author.id, user.id, amount)
        var balText = `${user.username} has been paid **${amount}** ${currency} by ${message.author.username}.`
        var balembed = new Discord.RichEmbed().addField(user.username, balText).setColor(colors.gamble_green);
        message.channel.send(balembed);
        const channel = client.channels.get(msg.ecologid);
        if (message.guild.id != "625021277295345667") channel.send(balembed)
        if (message.guild.id != "625021277295345667") channel.send(`(${message.author.id}) => (${user.id})`)
    }
    if (command === "nod") {
        let nodEmbed = new Discord.RichEmbed().addField("Nursery Rhyme (origin unknown)", "Let\u2019s all forsake,\r\nThe Land of Wake,\r\nAnd break for the Land of Nod.\r\n\r\nWhere we can try,\r\nTo touch the sky,\r\nOr dance beneath the sod.\r\n\r\nA toll for the living,\r\nA toll for the lost,\r\nA toll for the wise ones,\r\nWho tally the cost,\r\n\r\nSo let\u2019s escape,\r\nDue south of \u2009Wake,\r\nAnd make for the Land of Nod.\r\n");
        message.channel.send(nodEmbed);
    }
    if (command === "scripture") {
        let wisdoms = ["Hear now, all who can discern true from fact, the indisputable account of the Toll, called forth from the beginning of time by the Great Resonance to walk among us, the Tone made flesh, in order to link us, the lost chosen, to the harmony from which we have fallen. Thus it came to pass in the Year of the Raptor that the Tone heralded a new era with a call heard round the world, and in that glorious moment breathed life into the mind-machine of humankind, making it a thing divine, and completing the sacred Triad of Tone, Toll, and Thunder. **All rejoice!**",
            "His seat of mercy rested at the mouth of Lenape, and there he would proclaim the truth of the Tone. Awesome was he in his splendor, such that even the slightest whisper from his lips would peal like thunder. Those who experienced his presence were changed forever and went out into the world with new purpose, and to those who doubted, he offered forgiveness. Forgiveness even for a bringer of death, for whom he did sacrifice his life, in his youth, only to rise again.**All rejoice!**",
            "The sanctimonious Sibilants who would wage unwarranted war were an abomination to the Toll. He would descend on them as the furious beating of a million wings, and the skies would rage with Thunder. The unrepentant would be struck down, but those who fell to their knees would be spared. Then he would leave them, dissolving once more into a storm of feathers and disappearing to the calming sky. **All rejoice!**",
            "\"Rise!\u201D the Toll called, amid the fearsome Thunder. \u201CRise and leave this place behind, for I have set a place for you on high.\u201D Then the Toll stood in the ring of fire, and, arms outstretched in the brimstone flames, he raised us up to the womb of Heaven, where we slept until the Tone called to us to be reborn, never to forget that the Toll remained in the Place Behind so that he might bring hope and intone songs of healing to that ancient wounded world. **All rejoice!**"]
        let scriptEmbed = new Discord.RichEmbed().addField("Scripture", wisdoms[Math.floor(Math.random() * wisdoms.length)]);
        message.channel.send(scriptEmbed);
    }
    if (command === "rps") {
        let choice = args[0];
        if (!choice) return message.channel.send(msg.rps_invalid);
        choice = choice.toLowerCase();
        if (choice === "rock" || choice === "r") {
            message.channel.send(msg.rps_r);
        } else if (choice === "paper" || choice === "p") {
            message.channel.send(msg.rps_p);
        } else if (choice === "scissors" || choice === "s") {
            message.channel.send(msg.rps_s);
        } else if (choice === "shoot") {
            message.channel.send(msg.rps_g);
        }
        else return message.channel.send(msg.rps_invalid)
    }
    if (command === "cf" || command === "coinflip") {
        var user = message.mentions.users.first()
        var amount = args[1]
        var side = args[2]
        if (!user) return message.reply(msg.coinflip_who)
        if (!amount) return message.reply(msg.coinflip_amt)
        if (!side) return message.reply(msg.coinflip_side)
        if (side.toLowerCase() !== "heads" && side.toLowerCase() !== "tails") return message.reply(msg.coinflip_side)
        side = side.toLowerCase()
        var output = await eco.FetchBalance(message.author.id)
        if (output.balance < amount || isNaN(amount) || amount < 1) return message.reply(msg.coinflip_namt)
        var _output = await eco.FetchBalance(user.id)
        if (_output.balance < amount) return message.reply(user.username + msg.coinflipnfund)
        if (message.author.id === user.id) return message.channel.send(msg.coinflip_noself)
        message.channel.send((msg.coinflip_doacc).replace("[@USER]", `<@!${user.id}>`).replace("[PREFIX]", prefix));
        try {
            var response = await message.channel.awaitMessages(message2 => message2.author.id === user.id && (message2.content === prefix + "acceptcf" || message2.content === prefix + "cfaccept" || message2
                .content === prefix + "accept" || message2.content === prefix + "cf" || message2.content === prefix + "cfyes"), {
                    maxMatches: 1,
                    time: 7000,
                    errors: ["time"]
                });
        } catch (err) {
            console.error(err);
            return message.channel.send((msg.coin_noacc).replace("PREFIX", prefix));
        }
        const choice = (response.first().content);
        if (choice) {
            var randoms = ["tails", "tails", "heads", "tails", "tails", "tails", "heads", "heads", "heads", "heads", "tails", "tails", "heads", "tails", "heads", "heads", "tails", "tails", "heads", "tails",
                "heads", "heads", "heads", "heads", "tails", "heads", "tails", "tails"
            ] // guarantee randomness, lookng at YOU squines
            var item = randoms[Math.floor(Math.random() * randoms.length)]
            if (side === item) {
                item.charAt(0).toUpperCase()
                message.channel.send((coinflip_whowon).replace("[ITEM]", item).replace("[@USER]" `<@!${message.author.id}>`).replace("[AMOUNT]", amount).replace("[CURRENCY]", currency))
                var transfer = await eco.Transfer(user.id, message.author.id, amount)
                var balText = `${message.author.username} won **${amount}** ${currency} from  ${user.username}.`
                var balembed = new Discord.RichEmbed().addField(message.author.username, balText).setColor(colors.gamble_green);
                const channel = client.channels.get(msg.ecologid);
                if (message.guild.id != "625021277295345667") channel.send(balembed)
                if (message.guild.id != "625021277295345667") channel.send(`(${user.id}) => (${message.author.id})`)
            } else {
                item.charAt(0).toUpperCase()
                message.channel.send((coinflip_whowon).replace("[ITEM]", item).replace("[@USER]" `<@!${user.id}>`).replace("[AMOUNT]", amount).replace("[CURRENCY]", currency))
                var transfer = await eco.Transfer(message.author.id, user.id, amount)
                var balText = `${user.username} won **${amount}** ${currency} from ${message.author.username}.`
                var balembed = new Discord.RichEmbed().addField(user.username, balText).setColor(colors.gamble_green);
                const channel = client.channels.get(msg.ecologid);
                if (message.guild.id != "625021277295345667") channel.send(balembed)
                if (message.guild.id != "625021277295345667") channel.send(`(${message.author.id}) => (${user.id})`)
            }
        }
    }
    if (command === "steal" || command === "theft" || command === "rob" || command === "pickpocket" || command === "liberateofvibes") {
        var user = message.mentions.users.first()
        let robState = false;
        if (!user) return message.reply(msg.rob_who)
        var output = await eco.FetchBalance(message.author.id)
        if (output.balance < 50) return message.reply(msg.rob_moneyyoufail)
        var _output = await eco.FetchBalance(user.id)
        if (_output.balance < 50) return message.reply(msg.rob_moneythemfail)
        var output = await eco.Daily(message.author.id)
        let isAlt = 0;
        if (altlist.alts.indexOf(message.author.id) >= 0) isAlt = 32767;
        if (output.updated) {
            message.channel.send((msg.rob_beingrobbed).replace("[PREFIX]", prefix).replace("[@USER]", `<@!${user.id}>`))
            try {
                var response = await message.channel.awaitMessages(message2 => message2.author.id === user.id && (message2.content === prefix + "deny" || message2.content === prefix + "s" || message2.content ===
                    prefix + "no" || message2.content === prefix + "x" || message2.content === prefix + "stoptheif"), {
                        maxMatches: 1,
                        time: 7000,
                        errors: ["time"]
                    });
            } catch (err) {
                message.channel.send(msg.rob_stopfail);
                var stealthIncrease = 0;
                for (var item in items[message.author.id]) {
                    item = items[message.author.id][item]
                    if (item.type === "Weapon") {
                        stealthIncrease += parseInt(item["theftSuccess"]);
                    }
                }
                for (var item in items[user.id]) {
                    item = items[user.id][item]
                    if (item.type === "Weapon") {
                        stealthIncrease -= parseInt(item["antiTheftSuccess"]);
                    }
                }
                stealthIncrease = parseInt(stealthIncrease);
                let stealthCheck = Math.floor((Math.random() * 10) + 1);
                if (!(stealthCheck > (isAlt + (100 - (msg.rob_win_chance + stealthIncrease)) / 10))) return message.channel.send(msg.rob_stealthfail);
                var transfer = await eco.Transfer(user.id, message.author.id, 3 * stealthCheck - 2)
                var balText = (msg.rob_stole).replace("[AUTHOR]", message.author.username).replace("[AMOUNT]", (3 * stealthCheck - 2)).replace("[CURRENCY]", currency).replace("[USER]", user.username)
                var balembed = new Discord.RichEmbed().addField(message.author.username, balText).setColor(colors.gamble_green);
                message.channel.send(balembed);
                const channel = client.channels.get(msg.ecologid);
                if (message.guild.id != "625021277295345667") channel.send(balembed)
                if (message.guild.id != "625021277295345667") channel.send(`(${user.id}) => (${message.author.id})`)
                robState = true;
            }
            //punishment
            if (robState) return;
            var transfer = await eco.Transfer(message.author.id, user.id, msg.rob_penalty)
            var balText = (msg.rob_punish).replace("[AUTHOR]", message.author.username).replace("[PENALTY]", msg.rob_penalty).replace("[CURRENCY]", currency).replace("[USER]", user.username)
            var balembed = new Discord.RichEmbed().addField(user.username, balText).setColor(colors.gamble_green);
            message.channel.send(balembed);
            const channel = client.channels.get(msg.ecologid);
            if (message.guild.id != "625021277295345667") channel.send(balembed)
            if (message.guild.id != "625021277295345667") channel.send(`(${message.author.id}) => (${user.id})`)
        } else {
            message.channel.send(msg.rob_nodaily);
        }
    }
    if (command === "undebt") {
        var currencyCount = await eco.FetchBalance(message.author.id)
        currencyCount = currencyCount.balance
        if (currencyCount < 0) {
            await eco.AddToBalance(message.author.id, (currencyCount * -1))
            message.channel.send(msg.undebt_reset)
            const channel = client.channels.get(msg.ecologid);
            if (message.guild.id != "625021277295345667") channel.send(`${message.author.username} (${message.author.id})  reset their balance`)
        } else {
            message.channel.send(msg.undebt_notbelowzero)
        }
    }
    if (command === "daily") {
        let dailyAmount = Math.floor(Math.random() * msg.daily_high) + msg.daily_low;
        if (altlist.alts.indexOf(message.author.id) >= 0) dailyAmount = 3;
        var output = await eco.Daily(message.author.id)
        //output.updated will tell you if the user already claimed his/her daily yes or  no.
        if (output.updated) {
            var dailyProfile = await eco.AddToBalance(message.author.id, dailyAmount)
            message.channel.send(((msg.daily_confirm).replace("[DAILYAMOUNT]", dailyAmount).replace("[CUR]", currency)).replace("[NEWBALANCE]", dailyProfile.newbalance).replace("[CUR]", currency));
            const channel = client.channels.get(msg.ecologid);
            if (message.guild.id != "625021277295345667") channel.send(`${message.author.username} (${message.author.id}) did their daily and got ${dailyAmount} leaving them with ${dailyProfile.newbalance} ${currency}`);
        } else {
            message.channel.send((msg.daily_invalid).replace("[TIMETOWAIT]", output.timetowait))
        }
    }
    if (command === "leaderboard" || command === "scythe" || command === "richest" || command === "baltop" || command === "vibetop" || command === "top") {
        //If you use discord-economy guild based you can use the filter() function to only allow the database within your guild
        //(message.author.id + message.guild.id) can be your way to store guild based id's
        //filter: x => x.userid.endsWith(message.guild.id)
        //If you put a mention behind the command it searches for the mentioned user in database and tells the position.
        if (message.mentions.users.first()) {
            var output = await eco.Leaderboard({
                filter: x => x.balance > 50,
                search: message.mentions.users.first().id
            })
            message.channel.send(`${(output).toString().replace("Not found", "?")} - ${message.mentions.users.first().username}`);
        } else {
            eco.Leaderboard({}).then(async users => { //async
                if (users[0]) var firstplace = await client.fetchUser(users[0].userid) //Searches for the user object in discord for first place
                if (users[1]) var secondplace = await client.fetchUser(users[1].userid) //Searches for the user object in discord for second place
                if (users[2]) var thirdplace = await client.fetchUser(users[2].userid) //Searches for the user object in discord for third place
                if (users[3]) var fourthplace = await client.fetchUser(users[3].userid)
                if (users[4]) var fifthplace = await client.fetchUser(users[4].userid)
                message.channel.send(`The Leaderboard:\n1 - ${firstplace && firstplace.username || 'Nobody Yet'} : ${users[0] && users[0].balance || 'None'} ${currency}\n2 - ${secondplace && secondplace.username || 'Nobody Yet'} : ${users[1] && users[1].balance || 'None'} ${currency}\n3 - ${thirdplace && thirdplace.username || 'Nobody Yet'} : ${users[2] && users[2].balance || 'None'} ${currency}\n4 - ${fourthplace && fourthplace.username || 'Nobody Yet'} : ${users[3] && users[3].balance || 'None'} ${currency}\n5 - ${fifthplace && fifthplace.username || 'Nobody Yet'} : ${users[4] && users[4].balance || 'None'} ${currency}`)
            })
        }
    }
    if (command === "work") {
        let hasVoted = false;
        try {
            hasVoted = await dbl.hasVoted(message.author.id);
        } catch (err) {
            hasVoted = false;

        }
        let failurerate = 40 - (hasVoted * (msg.work_vote_percent_adder));
        if (altlist.alts.indexOf(message.author.id) >= 0) failurerate = 100;
        //10% chance to fail and earn nothing. You earn between 1-500 coins. And you get one of those 3 random jobs.
        if (workedRecently.has(message.author.id)) {
            message.channel.send(msg.work_wait);
        } else {
            // Adds the user to the set so that they can't talk for a minute
            workedRecently.add(message.author.id);
            setTimeout(() => {
                // Removes the user from the set after a minute
                workedRecently.delete(message.author.id);
            }, 300000);
            var output = await eco.Work(message.author.id, {
                failurerate: failurerate,
                money: Math.floor((Math.random() * 9) + 1),
                jobs: ["null"]
            })
            //50% chance to fail and earn nothing. You earn between 1-9
            if (output.earned == 0) return message.reply((msg.work_fail).replace("[PREFIX]", prefix))
            message.channel.send((msg.work_success).replace("[EARNED]", output.earned).replace("[BALANCE]", output.balance).replace("[CURRENCY]", currency).replace("[CURRENCY]", currency))
            const channel = client.channels.get(msg.ecologid);
            if (message.guild.id != "625021277295345667") channel.send(`${message.author.username} (${message.author.id}) worked and earned ${output.earned} ${currency}. They now own ${output.balance} ${currency}.`)
        }
    }
    if (command === "sell") {
        var toSell = args[0];
        if (!items[message.author.id][toSell]) return message.channel.send(msg.sell_lackitem);
        var item = items[message.author.id][toSell];
        var cost = item.cost;
        var robeColor = item.robecolor;
        item.sellerid = message.author.id;
        item.ownerid = "marketplace";
        var itemName = item.name;
        items["marketplace"][toSell] = (items[message.author.id][toSell])
        delete items[message.author.id][toSell];
        message.channel.send(`You sold ${itemName} for ${cost} ${currency}.`)
        if (!robeColor) return;
        let robeRole = client.guilds.get(`625021277295345667`).roles.find(r => r.name === (robeColor.charAt(0).toUpperCase() + robeColor.slice(1).toLowerCase() + " Robe").replace("Tonist Robe",
            "Tonist Frock"));
        if (robeRole) { //robe role and thunder nonsense
            client.guilds.get(`625021277295345667`).member(message.author.id).removeRole(robeRole)
            message.channel.send(`The ${robeRole.name} role was unassigned.`);
        }
    }
    if (command === "buy") {
        var toBuy = args[0];
        if (!items["marketplace"][toBuy]) return message.channel.send(msg.inv_noresult);
        var item = items["marketplace"][toBuy];
        var cost = item.cost;
        var vendor = item.sellerid;
        var itemName = item.name;
        var balance = await eco.FetchBalance(message.author.id);
        if (balance.balance < cost) return message.channel.send(`${msg.buy_nofunds} ${(cost - balance.balance)} more ${currency}.`);
        await eco.AddToBalance(message.author.id, cost * -1)
        if (!items[message.author.id]) {
            items[message.author.id] = {};
        }
        items[message.author.id][toBuy] = (items["marketplace"][toBuy])
        if (!vault[vendor]) {
            vault[vendor] = {
                amount: cost
            };
        } else {
            vault[vendor].amount = (parseInt(vault[vendor].amount) + parseInt(cost))
        }
        delete items["marketplace"][toBuy];
        item.ownerid = message.author.id;
        message.channel.send(`You bought ${itemName} for ${cost} ${currency}.`)
        const channel = client.channels.get(msg.ecologid);
        if (message.guild.id != "625021277295345667") channel.send(`${message.author.username} bought ${itemName} for ${cost} ${currency} from (${vendor}).`)
    }
    if (command === "reap") {
        if (!vault[message.author.id]) return message.channel.send(msg.reap_nosell);
        if (vault[message.author.id].amount == 0) return message.channel.send(msg.reap_noearn)
        var cost = vault[message.author.id].amount;
        vault[message.author.id].amount = 0;
        await eco.AddToBalance(message.author.id, cost)
        message.channel.send(`${msg.reap_reap} ${cost} ${currency}.`)
    }
    if (command === "inv" || command === "inventory" || command === "i") {
        let user = args[0];
        if (!user) user = message.author.id;
        user = user.replace(/[@!<>]/g, "");
        if (!message.guild.member(client.user).hasPermission("MANAGE_MESSAGES")) return message.channel.send(msg.permdeny_managemessages);
        if (!message.guild.member(client.user).hasPermission("ADD_REACTIONS")) return message.channel.send(msg.permdeny_addreactions);
        if (!items[user]) return message.channel.send(msg.inv_noresults);
        var embeds = [];
        var myItems = items[user];
        var count = -1;
        for (var item in myItems) {
            count++;
            var footer = item;
            item = myItems[item];
            var title = `${item.name} ${item.emoji}`;
            var description = item.description;
            var image = item.image;
            var type = item.type;
            cost = item.cost
            embeds.push({
                title: title,
                description: description,
                color: 4439665,
                footer: {
                    text: `Value: ${cost}      Sell with ${prefix}sell ${footer}`
                },
                thumbnail: {
                    url: image
                },
                author: {
                    name: type,
                    icon_url: "https://cdn.glitch.com/a09f5b5e-9054-4afc-8dcc-67ede76ea11c%2FThunder.png?v=1574998975490"
                }
            });
        }
        var username_message = client.users.get(user)
        username_message = username_message.username
        if (user === 'marketplace') {
            username_message = 'Marketplace'
        }
        message.channel.send("Inventory|| " + username_message + ":  " + (count + 1))
        var b = "◀";
        var f = "▶";
        var page = args[1] - 1;
        if (!embeds[page - 1]) page = 0;
        var embed = embeds[page];
        const m = await message.channel.send({
            embed
        });
        m.react(b).then(() => m.react(f));
        const filter = (reaction, user) => {
            return (
                [b, f].includes(reaction.emoji.name) && user.id === message.author.id);
        };
        m.createReactionCollector(filter, {
            time: 60000,
            errors: ["time"]
        }).on("collect", reaction => {
            if (reaction.emoji.name === f) {
                if (page == count) return;
                reaction.users.filter(u => !u.bot).forEach(user => {
                    reaction.remove(user.id);
                });
                page++;
                var embed = embeds[page];
                m.edit({
                    embed
                });
            } else if (reaction.emoji.name === b) {
                if (page == 0) return;
                reaction.users.filter(u => !u.bot).forEach(user => {
                    reaction.remove(user.id);
                });
                page--;
                var embed = embeds[page];
                m.edit({
                    embed
                });
            }
        }).on("end", collected => { });
    }
    if (command === "market" || command === "marketplace") {
        if (!message.guild.member(client.user).hasPermission("MANAGE_MESSAGES")) return message.channel.send(msg.permdeny_managemessages);
        if (!message.guild.member(client.user).hasPermission("ADD_REACTIONS")) return message.channel.send(msg.permdeny_addreactions);
        if (items["marketplace"][0]) {
            message.channel.send("Market is empty.");
        } else {
            var embeds = [];
            var myItems = items["marketplace"];
            var count = -1;
            for (var item in myItems) {
                count++;
                var footer = item;
                item = myItems[item];
                var title = `${item.name} ${item.emoji}`;
                var description = item.description;
                var image = item.image;
                var type = item.type;
                var cost = item.cost
                var seller = item.sellerid
                embeds.push({
                    title: title,
                    description: description,
                    color: 4439665,
                    footer: {
                        text: `Cost: ${cost}      Buy with ${prefix}buy ${footer}`
                    },
                    thumbnail: {
                        url: image
                    },
                    author: {
                        name: type,
                        icon_url: "https://cdn.glitch.com/a09f5b5e-9054-4afc-8dcc-67ede76ea11c%2FThunder.png?v=1574998975490"
                    }
                });
            }
            message.channel.send("Stock: " + (count + 1) + " items.")
            var b = "◀";
            var f = "▶";
            var page = args[0] - 1;
            if (!embeds[page - 1]) page = 0; // -1 because computers start at 0 :eye_roll_emoji_keanu_chungus_wholsome:
            var embed = embeds[page];
            const m = await message.channel.send({
                embed
            });
            m.react(b).then(() => m.react(f));
            const filter = (reaction, user) => {
                return (
                    [b, f].includes(reaction.emoji.name) && user.id === message.author.id);
            };
            m.createReactionCollector(filter, {
                time: 60000,
                errors: ["time"]
            }).on("collect", reaction => {
                if (reaction.emoji.name === f) {
                    if (page == count) return;
                    reaction.users.filter(u => !u.bot).forEach(user => {
                        reaction.remove(user.id);
                    });
                    page++;
                    var embed = embeds[page];
                    m.edit({
                        embed
                    });
                } else if (reaction.emoji.name === b) {
                    if (page == 0) return;
                    reaction.users.filter(u => !u.bot).forEach(user => {
                        reaction.remove(user.id);
                    });
                    page--;
                    var embed = embeds[page];
                    m.edit({
                        embed
                    });
                }
            }).on("end", collected => { });
        }
    }
    if (command === "stocks" || command === "stonks" || command === "stock") {
        try {
            let index = 0;
            var target;
            if (args[0]) target = client.users.get(args[0].replace(/[@!<>]/g, ""));
            if (!target) target = message.author;
            if (args[0]) args[0] = args[0].toUpperCase()
            if (!shares[message.author.id]) shares[message.author.id] = {}
            if (target && (!msg.stocks[args[0]])) {
                let stockMessage = `**${target.username}'s Portfolio**`;
                for (var i in msg.stocks) {
                    let sharesOf = 0;
                    if (shares[target.id][Object.keys(msg.stocks)[index]]) sharesOf = shares[target.id][Object.keys(msg.stocks)[index]];
                    stockMessage += `\n${msg.stocks[i][0]}: ${Object.keys(msg.stocks)[index]} | Owned: ${sharesOf} shares`;
                    index++
                }
                message.channel.send(stockMessage);
            } else {
                if (!msg.stocks[args[0]]) return message.channel.send(msg.stocks_invalid);
                alpha.data.intraday(msg.stocks[args[0]][1]).then(data => { // [1] because thats the name of the irl company its mirroring :0
                    let stockPrice = (parseInt(data["Time Series (1min)"][Object.keys(data["Time Series (1min)"])[0]]["4. close"]));
                    let oldPrice = (parseInt(data["Time Series (1min)"][Object.keys(data["Time Series (1min)"])[1]]["4. close"]));
                    message.channel.send(`${msg.stocks[args[0]][0]} (${args[0]}) @ ${stockPrice} ${currency}`);
                });
            }
        } catch (err) {
            console.log(err)
        }
    }
    if (command === "invest") {
        if (!shares[message.author.id]) shares[message.author.id] = {};
        if (!args[0]) return message.channel.send(msg.invest_invalid);
        if (args[0] < 1) return message.channel.send(msg.invest_invalid);
        if (!args[1]) return message.channel.send(msg.invest_nshares);
        if (!msg.stocks[args[0].toUpperCase()]) return message.channel.send(msg.invest_invalid);
        var output = await eco.FetchBalance(message.author.id)
        alpha.data.intraday(msg.stocks[args[0].toUpperCase()][1]).then(data => {
            let stockPrice = (parseInt(data["Time Series (1min)"][Object.keys(data["Time Series (1min)"])[0]]["4. close"]));
            if (output.balance < stockPrice * parseInt(args[1])) return message.channel.send(msg.invest_amt);
            if (!shares[message.author.id][args[0].toUpperCase()]) shares[message.author.id][args[0].toUpperCase()] = 0;
            shares[message.author.id][args[0].toUpperCase()] += parseInt(args[1])
            eco.AddToBalance(message.author.id, stockPrice * args[1] * -1)
            message.channel.send(`Shares purchased for ${stockPrice * args[1]} ${currency}. You now have ${shares[message.author.id][args[0].toUpperCase()]} shares in ${args[0].toUpperCase()}.`)
            const channel = client.channels.get(msg.ecologid);
            if (message.guild.id != "625021277295345667") channel.send(`${message.author.username} (${message.author.id})  purchased shares for ${stockPrice * args[1]} ${currency}. they now have ${shares[message.author.id][args[0].toUpperCase()]} shares in ${args[0].toUpperCase()}.`)
        });
    }
    if (command === "cashout") {
        if (!args[0]) return message.channel.send(msg.cashout_invalid);
        if (args[0] < 1) return message.channel.send(msg.cashout_invalid);
        if (!shares[message.author.id][args[0].toUpperCase()]) return message.channel.send(msg.cashout_invalid); // If no shares then just end the check o_0
        if (!args[1]) return message.channel.send(msg.cashout_nshares);
        if (shares[message.author.id][args[0].toUpperCase()] < args[1]) return message.channel.send(msg.cashout_nshares);
        alpha.data.intraday(msg.stocks[args[0].toUpperCase()][1]).then(data => {
            let stockPrice = (parseInt(data["Time Series (1min)"][Object.keys(data["Time Series (1min)"])[0]]["4. close"]));
            shares[message.author.id][args[0].toUpperCase()] -= parseInt(args[1])
            eco.AddToBalance(message.author.id, stockPrice * args[1])
            message.channel.send(`Shares sold for ${stockPrice * args[1]} ${currency}. You now have ${shares[message.author.id][args[0].toUpperCase()]} shares in ${args[0].toUpperCase()}.`)
            const channel = client.channels.get(msg.ecologid);
            channel.send(`Shares sold for ${stockPrice * args[1]} ${currency}. ${message.author.username} (${message.author.id}) now has ${shares[message.author.id][args[0].toUpperCase()]} shares in ${args[0].toUpperCase()}.`)
        })
    }
    if (command === "poll") {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(msg.permdeny_managemessages);
        if (!args[0]) return message.channel.send(msg.poll_novalidq).then(message.channel.bulkDelete(1)).then(msg => msg.delete({
            timeout: 1000000000000
        }));
        message.channel.bulkDelete(1);
        message.channel.send({
            embed: {
                color: 0x69d84b,
                title: "Poll",
                description: `${args}`.split(",").join(" ")
            }
        }).then(async function (msg) {
            await msg.react("✅");
            await msg.react("⛔");
        }).catch(function () { });
    }
    if (command === "announce") {
        message.delete();
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(msg.permdeny_managemessages);
        var titl = args[0];
        var content = args.slice(1).join(" ");
        const embed = {
            title: titl,
            description: content,
            color: 9402623,
            author: {
                name: message.author.username,
                icon_url: message.author.displayAvatarURL
            }
        };
        message.channel.send({
            embed
        });
    }
    if (command === "vote") {
        message.channel.send(`Vote Here: https://top.gg/bot/${auth.client_id}/vote`)
    }
    if (command === "invite") {
        message.channel.send(`Invite Here: https://discordapp.com/oauth2/authorize?client_id=${auth.client_id}&scope=bot&permissions=8`)
    }
    if (command === "lang" || command === "language" || command === "l") {
        if (!args[0]) return message.channel.send(msg.lang_is + prefs[message.author.id]);
        args[0] = args[0].toLowerCase();

        prefs[message.author.id] = args[0];
        if (!global_msgs[prefs[message.author.id]]) return message.channel.send(args[0] + msg.lang_nvalid + ((Object.keys(global_msgs)).join(", ")));
        message.channel.send(msg.lang_set + args[0])

    }
    if (command === "purge") {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(msg.permdeny_managemessages)
        const deleteCount = parseInt(args[0], 10);
        if (!deleteCount || deleteCount < 2 || deleteCount > 100) return message.reply(msg.purge_nvamount);
        message.channel.bulkDelete(deleteCount).catch(error => message.reply(msg.purge_err + error));
    }
    if (command === "say") {
        if (!(message.member.hasPermission("MANAGE_MESSAGES"))) return message.channel.send(msg.permdeny_managemessages);
        const sayMessage = args.join(" ");
        message.delete().catch(O_o => { }); // O_o - Cut him some slack, he just woke up!
        message.channel.send(sayMessage);
    }
    if (command === "lock") {
        if (!message.member.hasPermission("MANAGE_CHANNELS")) return message.reply(msg.permdeny_managechannels);
        message.channel.overwritePermissions(message.guild.defaultRole, {
            SEND_MESSAGES: false
        }).then(updated => console.log(updated.permissionOverwrites.get(message.author.id))).catch(console.error);
        message.channel.send(msg.lock)
    }
    if (command === "unlock") {
        if (!message.member.hasPermission("MANAGE_CHANNELS")) return message.reply(msg.permdeny_managechannels);
        message.channel.overwritePermissions(message.guild.defaultRole, {
            SEND_MESSAGES: true
        }).then(updated => console.log(updated.permissionOverwrites.get(message.author.id))).catch(console.error);
        message.channel.send(msg.unlock)
    }
    if (command === "kick") {
        if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply(msg.permdeny_kickmembers);
        let member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member) return message.reply(msg.punish_novalidmention);
        if (!member.kickable) return message.reply(msg.kick_unkickable);
        let reason = args.slice(1).join(" ");
        if (!reason) reason = msg.kick_noreason;
        await member.kick(reason).catch(error => message.reply(error));
        message.channel.send(`${member.user.tag} has been kicked by ${message.author.tag}\n**Reason**:\n${reason}`);
    }
    if (command === "ban" || command === "execute" || command === "glean") {
        if (!message.member.hasPermission("BAN_MEMBERS")) return message.reply(msg.permdeny_banmembers);
        let member = message.mentions.members.first();
        if (!member) return message.reply(msg.punish_novalidmention);
        if (!member.bannable) return message.reply(msg.ban_unbannable);
        let reason = args.slice(1).join(" ");
        if (!reason) reason = msg.ban_noreason;
        await member.ban(reason).catch(error => message.reply(error));
        message.reply(`${member.user.tag} has been banned by ${message.author.tag}\n**Reason**:\n${reason}`);
    }
    if (command === "unsavory" || command === "mute" || command === "dunce") {
        if (!message.guild.member(message.author).hasPermission("MUTE_MEMBERS")) return message.channel.send(msg.permdeny_mutemembers);
        if (!message.guild.member(client.user).hasPermission("MANAGE_ROLES")) return message.channel.send(msg.permdeny_manageroles);
        let reasonMute = message.content.split(" ").slice(3).join(" ");
        let timeMute = message.content.split(" ")[2];
        let guildMute = message.guild;
        let memberMute = message.guild.member;
        let userMute = message.mentions.users.first();
        let muteRoleMute = client.guilds.get(message.guild.id).roles.find("name", "Unsavory");
        if (!muteRoleMute) return message.channel.send(msg.mute_norole);
        if (message.mentions.users.size < 1) return message.channel.send(msg.mute_noping)
        if (message.author.id === userMute.id) return message.channel.send(msg.mute_noself)
        if (!timeMute) return message.channel.send(msg.mute_notime)
        if (!timeMute.match(/[s,m,h,d,w]/g)) return message.channel.send(msg.mute_notime)
        if (!reasonMute) return message.channel.send(msg.mute_noreason)
        if (reasonMute.length < 1) return message.channel.send(msg.mute_noreason)
        message.guild.member(userMute).addRole(muteRoleMute);
        setTimeout(() => {
            message.guild.member(userMute).removeRole(muteRoleMute);
        }, msmute(timeMute));
        message.guild.channels.filter(textchannel => textchannel.type === "text").forEach(cnl => {
            cnl.overwritePermissions(muteRoleMute, {
                SEND_MESSAGES: false
            });
        });
        message.channel.send(msg.mute_worked);
        message.channel.send({
            embed: {
                color: 16745560,
                author: {
                    name: userMute.username,
                    icon_url: client.user.avatarURL
                },
                fields: [{
                    name: "Unsavory",
                    value: `**Unsavoried:**${userMute.username}#${userMute.discriminator}\n**Grandslayer:**${message.author.username}\n**Duration:**${msmute(msmute(timeMute), { long: true })}\n**Reason:**${reasonMute}`
                }],
                timestamp: new Date(),
                footer: {
                    icon_url: client.user.avatarURL
                }
            }
        });
    }
    // Music Commands
    if (command === "play") {
        if (!message.member.roles.find(a => msg.music_musicrole === a.name)) return message.channel.send(msg.permdeny_musicrole);
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) return message.channel.send(msg.music_notinvc)
        const url = args.join(" ")
        if (url.includes("list=")) {
            const playlist = await ytpl(url.split("list=")[1])
            const videos = playlist.items;
            message.channel.send((msg.music_playlisthasbeenadded).replace("[PLAYLIST_TITLE]", `${playlist.title} (${videos.length})`))
            for (const video of videos) await queueSong(video, message, voiceChannel, queue)
        } else {
            let video;
            try {
                video = await ytdl.getBasicInfo(url)
            } catch (e) {
                try {
                    const results = await ytsr(url)
                    const videos = results.videos.slice(0, 10)
                    let index = 0;
                    await message.channel.send([
                        "__**Song selection:**__",
                        videos.map(v => ++index + " - **" + v.title + "**").join("\n"),
                        (msg.music_songselect).replace("[LIST_LENGTH]", videos.length)
                    ].join("\n\n"))
                    let response;
                    try {
                        response = await message.channel.awaitMessages(msg => 0 < msg.content && msg.content < videos.length + 1 && msg.author.id == message.author.id, {
                            maxMatches: 1,
                            time: 10000,
                            errors: ['time']
                        });
                    } catch (e) {
                        return message.channel.send(msg.music_cancelvideoselection)
                    }
                    const videoIndex = parseInt(response.first().content)
                    video = await ytdl.getBasicInfo(videos[videoIndex - 1].videoId)
                } catch (e) {
                    console.log(e)
                    return message.channel.send(msg.noresult)
                }
            }
            await message.channel.send((msg.music_videohasbeenadded).replace("[VIDEO_TITLE]", `${video.title}`))
            return await queueSong(video, message, voiceChannel, queue)
        }
    }
    if (command === "stop") {
        if (!message.member.roles.find(a => msg.music_musicrole === a.name)) return message.channel.send(msg.permdeny_musicrole);
        if (!message.member.voiceChannel) return message.channel.send(msg.music_notinvc)
        const serverQueue = queue.get(message.guild.id)
        if (!serverQueue) return message.channel.send(msg.music_noqueue)
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end('Skip command has been used!')
        return message.channel.send(msg.music_stop)
    }
    if (command === "pause") {
        if (!message.member.roles.find(a => msg.music_musicrole === a.name)) return message.channel.send(msg.permdeny_musicrole);
        if (!message.member.voiceChannel) return message.channel.send(msg.music_notinvc)
        const serverQueue = queue.get(message.guild.id)
        if (!serverQueue) return message.channel.send(msg.music_noqueue)
        serverQueue.playing = false
        serverQueue.connection.dispatcher.pause()
        return message.channel.send(msg.music_paused)
    }
    if (command === "resume") {
        if (!message.member.roles.find(a => msg.music_musicrole === a.name)) return message.channel.send(msg.permdeny_musicrole);
        if (!message.member.voiceChannel) return message.channel.send(msg.music_notinvc)
        const serverQueue = queue.get(message.guild.id)
        if (!serverQueue) return message.channel.send(msg.music_noqueue)
        serverQueue.playing = true
        serverQueue.connection.dispatcher.resume()
        return message.channel.send(msg.music_resumed)
    }
    if (command === "skip") {
        if (!message.member.roles.find(a => msg.music_musicrole === a.name)) return message.channel.send(msg.permdeny_musicrole);
        if (!message.member.voiceChannel) return message.channel.send(msg.music_notinvc)
        const serverQueue = queue.get(message.guild.id)
        if (!serverQueue) return message.channel.send(msg.music_noqueue)
        await message.channel.send(msg.music_skip)
        return serverQueue.connection.dispatcher.end('Skip command has been used!')
    }
    if (command === "volume" || command === "vol" || command === "v" || command === "v") {
        if (!message.member.roles.find(a => msg.music_musicrole === a.name)) return message.channel.send(msg.permdeny_musicrole);
        if (!message.member.voiceChannel) return message.channel.send(msg.music_notinvc)
        const serverQueue = queue.get(message.guild.id)
        if (!serverQueue) return message.channel.send(msg.music_noqueue)
        if (!args[0]) return message.channel.send((msg.music_volis).replace("[VOL]", serverQueue.volume));
        const volume = parseInt(args[0])
        serverQueue.volume = volume;
        serverQueue.connection.dispatcher.setVolumeLogarithmic(volume / 250);
        return message.channel.send((msg.music_volis).replace("[VOL]", volume))
    }
    if (command === "queue") {
        if (!message.member.roles.find(a => msg.music_musicrole === a.name)) return message.channel.send(msg.permdeny_musicrole);
        const serverQueue = queue.get(message.guild.id)
        if (!serverQueue) return message.channel.send(msg.music_noqueue)
        return message.channel.send([
            "__**Song queue:**__",
            serverQueue.songs.map(song => "- " + song.title).join("\n"),
            "**Now playing:** " + serverQueue.songs[0].title
        ].join("\n\n"))
    }
    if (command === "np") {
        if (!message.member.roles.find(a => msg.music_musicrole === a.name)) return message.channel.send(msg.permdeny_musicrole);
        const serverQueue = queue.get(message.guild.id)
        if (!serverQueue) return message.channel.send(msg.music_noqueue);
        var volval = (msg.music_volumes[(Math.round(serverQueue.volume / 20)) - 1])
        if (!volval) volval = "Thunderhead Music";
        const MusicEmbed = {
            "embed": {
                "description": `ɴᴏᴡ ᴘʟᴀʏɪɴɢ \n **${serverQueue.songs[0].title}**`,
                "color": 9777040,
                "footer": {
                    "icon_url": "https://cdn.glitch.com/967bdf25-e9cb-4a1f-bdb5-a102880988a9%2FMusic%20Icon.png?v=1560799891254",
                    "text": volval
                },
                "thumbnail": {
                    "url": serverQueue.songs[0].thumbnail
                },
                "title": "Music"
            }
        }
        return message.channel.send(MusicEmbed);
    }
    // Custom 
    if (command == "kirby") { // Playlist Template
        if (!message.member.roles.find(a => msg.music_musicrole === a.name)) return message.channel.send(msg.permdeny_musicrole);
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) return message.channel.send(msg.music_notinvc)
        var url = "https://www.youtube.com/playlist?list=PLknfGUJh3EdHAha3t2Dmj7uRNIG64o6t5"
        const playlist = await ytpl(url.split("list=")[1])
        const videos = playlist.items;
        message.channel.send((msg.music_playlisthasbeenadded).replace("[PLAYLIST_TITLE]", `${playlist.title} (${videos.length})`))
        for (const video of videos) await queueSong(video, message, voiceChannel, queue)
    }
    if (command == "guiltygear" || command === "ggxrd") {
        if (!message.member.roles.find(a => msg.music_musicrole === a.name)) return message.channel.send(msg.permdeny_musicrole);
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) return message.channel.send(msg.music_notinvc)
        var url = "https://www.youtube.com/playlist?list=PLwXxYQlATbq2eOmzkyfsKY3RKroixzLox"
        const playlist = await ytpl(url.split("list=")[1])
        const videos = playlist.items;
        message.channel.send((msg.music_playlisthasbeenadded).replace("[PLAYLIST_TITLE]", `${playlist.title} (${videos.length})`))
        for (const video of videos) await queueSong(video, message, voiceChannel, queue)
    }
    if (command === "lofi") {
        if (!message.member.roles.find(a => msg.music_musicrole === a.name)) return message.channel.send(msg.permdeny_musicrole);
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) return message.channel.send(msg.music_notinvc)
        var url = "https://www.youtube.com/watch?v=5qap5aO4i9A"
        var video = await ytdl.getBasicInfo(url)
        await message.channel.send((msg.music_videohasbeenadded).replace("[VIDEO_TITLE]", `${video.title}`))
        return await queueSong(video, message, voiceChannel, queue)
    }
    if (command == "swoge") {
        if (!message.member.roles.find(a => msg.music_musicrole === a.name)) return message.channel.send(msg.permdeny_musicrole);
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) return message.channel.send(msg.music_notinvc)
        var url = "https://www.youtube.com/playlist?list=PL0aso3-ouj1yJDaJkq72TY9-WLuFC-oe_"
        const playlist = await ytpl(url.split("list=")[1])
        const videos = playlist.items;
        message.channel.send((msg.music_playlisthasbeenadded).replace("[PLAYLIST_TITLE]", `${playlist.title} (${videos.length})`))
        for (const video of videos) await queueSong(video, message, voiceChannel, queue)
    }
    if (command === "ghibli") {
        if (!message.member.roles.find(a => msg.music_musicrole === a.name)) return message.channel.send(msg.permdeny_musicrole);
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) return message.channel.send(msg.music_notinvc)
        var url = "https://www.youtube.com/watch?v=EmRi0Z7tdTY"
        var video = await ytdl.getBasicInfo(url)
        await message.channel.send((msg.music_videohasbeenadded).replace("[VIDEO_TITLE]", `${video.title}`))
        return await queueSong(video, message, voiceChannel, queue)
    }
});
//Dev Command System
client.on("message", async message => {


    const isDevExclusive = (message.author.id === developerId);
    if (message.content.indexOf(devPrefix) !== 0) return;
    const args = message.content.slice(devPrefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (!prefs[message.author.id]) prefs[message.author.id] = "en"
    if (!global_msgs[prefs[message.author.id]]) prefs[message.author.id] = "en"
    let lang = prefs[message.author.id]
    const msg = global_msgs[lang]

    if (command === "help") {
        var helpText;
        var commandData = {};
        commandData = helpList["dev"][args[0]];
        helpText = "__**Command:** *" + commandData["name"] + "*__\nInfo: " + commandData["desc"] + "\nUse: `" + devPrefix + commandData["use"] + "`"
        if (commandData["state"] === "beta") helpText = helpText + msg.help_beta;
        if (commandData["state"] === "delta") helpText = helpText + msg.help_delta;
        if (!helpText || !(commandData["name"])) helpText = "Error: No Command at `pages[" + (args[0]) + "]`";
        message.channel.send(helpText);
    }
    if (command === "ping") {
        const m = await message.channel.send(msg.ping_ping);
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    }
    if (command === "avatar") {
        if (!isDevExclusive) return;
        try {
            client.user.setAvatar(args.join(" ")).slice(6);
        } catch (err) {
            message.channel.send(`\`\`\`diff\n-ERROR\`\`\`\`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    }
    if (command === "repo") {
        message.channel.send(msg.repo_repo)
    }
    if (command === "name") {
        if (!isDevExclusive) return;
        try {
            client.user.setUsername(args.join(" ")).slice(4);
        } catch (err) {
            message.channel.send(`\`\`\`diff\n-ERROR\`\`\`\`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    }
    if (command === "dm") {
        if (!isDevExclusive) return;
        var messageToDm = args.slice(1).join(" ");
        var target = args[0].replace(/[@!<>]/g, "");
        try {
            client.users.get(target).send(messageToDm).catch(console.error);
        } catch (err) {
            message.channel.send(`\`\`\`diff\n-ERROR\`\`\`\`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    }
    if (command === "unsuspend") {
        if (!isDevExclusive) return;
        botSuspend = false;
        message.channel.send("Suspend = " + botSuspend)
    }
    if (command === "suspend") {
        if (!isDevExclusive) return;
        botSuspend = true;
        message.channel.send("Suspend = " + botSuspend)
    }
    if (command === "eval") {
        if (!isDevExclusive) return;
        try {
            const code = args.join(" ");
            let evaled = eval(code);
            if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    }
    if (command === "give") {
        if (!isDevExclusive) return;
        var recipient = message.mentions.members.first();
        if (!recipient) return message.reply("Please provide a vaild Mention.");
        var amountRecieved = parseInt(args[1], 10);
        if (!amountRecieved) return message.channel.send(message.author.username + " Please provide an amount to give.");
        output = await eco.AddToBalance(recipient.id, amountRecieved)
        var givebed = new Discord.RichEmbed().setTitle(`**Balance: **${output.newbalance}`).setFooter(`Thunderhead Banking. ` + message.mentions.users.first().username + `'s account was funded.`, message
            .mentions.users.first().displayAvatarURL).setColor(colors.gamble_green);
        message.channel.send(givebed);
    }
    if (command === 'resetdaily') {
        if (!isDevExclusive) return;
        args[0] = args[0].replace(/[@!<>]/g, "");
        var output = await eco.ResetDaily(args[0])
        message.channel.send("<@!" + args[0] + "> had their " + output) //It will send 'Daily Reset.'
    }
    if (command == "gs") {
        if (!isDevExclusive) return;
        let user = args[0];
        if (!user) user = message.author.id;
        user = client.users.get(user.replace(/[@!<>]/g, ""));
        var grandslayerRole = client.guilds.get(`625021277295345667`).roles.find('name', 'Grandslayer');
        client.guilds.get(`625021277295345667`).member(user).addRole(grandslayerRole);
    }
    if (command == "ugs") {
        if (!isDevExclusive) return;
        let user = args[0];
        if (!user) user = message.author.id;
        user = client.users.get(user.replace(/[@!<>]/g, ""));
        var grandslayerRole = client.guilds.get(`625021277295345667`).roles.find('name', 'Grandslayer');
        client.guilds.get(`625021277295345667`).member(user).removeRole(grandslayerRole);
    }
    if (command === "additem") {
        if (!isDevExclusive) return;
        let owner = args[0];
        if (!owner) owner = "marketplace";
        owner = owner.replace(/[@!<>]/g, "");
        if (!items[owner]) items[owner] = {};
        let name = args[1];
        let type = args[2];
        let id = args[3];
        let emoji = args[4].replace(":", "");
        let cost = args[5];
        let imageURL = args[6];
        let description = args.slice(7).join(" ");
        if (!type || !name || !id || !emoji || !cost || !imageURL || !description) return message.channel.send("Missing Field");
        items[owner][id] = {
            name: name,
            type: type,
            emoji: emoji,
            description: description,
            image: imageURL,
            cost: cost,
            sellerid: "marketplace"
        };
    }
    if (command === "addrobe") {
        if (!isDevExclusive) return;
        let owner = "marketplace";
        if (!items[owner]) items[owner] = {};
        let color = args[0];
        let id = args[1]
        let cost = args[2]
        let description = args.slice(3).join(" ");
        if (!id || !cost || !color || !description) return message.channel.send("Missing Field");
        items[owner][id] = {
            name: (color.charAt(0).toUpperCase() + color.toLowerCase().slice(1) + " Robe").replace("Tonist Robe", "Tonist Frock"),
            type: "Robe",
            emoji: "👗",
            description: description,
            image: `https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${color.toLowerCase()}.png`,
            cost: cost,
            robecolor: color.toLowerCase(),
            sellerid: "marketplace"
        };
        message.channel.send(items[owner][id].name + " was added.")
    }
    if (command === "addweapon") {
        if (!isDevExclusive) return;
        let owner = "marketplace";
        if (!items[owner]) items[owner] = {};
        let name = args[0]
        let theftSuccess = args[1];
        let antiTheftSuccess = args[2]
        let id = args[3]
        let cost = args[4]
        let description = args.slice(5).join(" ");
        if (!name || !id || !cost || !theftSuccess || !antiTheftSuccess || !description) return message.channel.send("Missing Field");
        items[owner][id] = {
            name: (name.charAt(0).toUpperCase() + name.toLowerCase().slice(1)).replace("Thunder", "Thunder Banking Solutions"),
            type: "Weapon",
            emoji: "⚔️",
            description: description + `\nStealth: ${theftSuccess}%\nDefence: ${antiTheftSuccess}%`,
            image: `https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${name.toLowerCase()}.png`,
            cost: cost,
            theftSuccess: theftSuccess,
            antiTheftSuccess: antiTheftSuccess,
            sellerid: "marketplace"
        };
        message.channel.send(items[owner][id].name + " was added.")
    }

    if (command === "markalt") {
        if (!isDevExclusive) return;
        if (!args[0]) return;
        altlist.alts.push(args[0])
        let user = client.users.get(args[0])
        message.channel.send(`${user.username} of (${user.id}) was marked as an alt to farm vibes.`)
    }
    if (command === "createinvite") {
        if (!isDevExclusive) return;
        var channel = client.channels.get(args[0])
        channel.createInvite({
            unique: args[1]
        })
            .then(invite => {
                message.reply("Hey! I've created you an invite: https://discord.gg/" + invite.code)
            })
    }
    if (command === "guilds") {
        if (!isDevExclusive) return;
        const GuildList = client.guilds.map(g => g.name + " ||" + g.id + "||  &" + g.members.filter(member => !member.user.bot).size).join('\n');
        message.channel.send(GuildList)
    }
    if (command === "channels") {
        if (!isDevExclusive) return;
        var guild = client.guilds.get(args[0])
        var channelList = guild.channels.map(c => c.name + " ||" + c.id + "||").join('\n');
        message.channel.send(channelList)
    }
});
//Async - Music
async function queueSong(video, message, voiceChannel, queue) {

    if (!prefs[message.author.id]) prefs[message.author.id] = "en"
    if (!global_msgs[prefs[message.author.id]]) prefs[message.author.id] = "en"
    let lang = prefs[message.author.id]
    const msg = global_msgs[lang]

    const serverQueue = queue.get(message.guild.id)
    let thumbnail = ""
    if (video.player_response) thumbnail = (video.player_response.videoDetails.thumbnail.thumbnails).slice(-1)[0]["url"];
    if (video.thumbnail) thumbnail = video.thumbnail;
    const song = {
        id: video.id || video.video_id,
        title: Util.escapeMarkdown(video.title),
        url: "https://www.youtube.com/watch?v=" + (video.id || video.video_url),
        thumbnail: thumbnail
    }
    if (!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel,
            connection: null,
            songs: [song],
            volume: 50, 
            playing: true
        }
        try {
            const connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            queue.set(message.guild.id, queueConstruct)
            playSong(message.guild, queue, queueConstruct.songs[0], message)
        } catch (e) {
            console.log(e)
            message.channel.send(msg.music_unknownerr)
            return queue.delete(message.guild.id)
        }
    } else serverQueue.songs.push(song);
    return;
}
async function playSong(guild, queue, song, message) {

    if (!prefs[message.author.id]) prefs[message.author.id] = "en"
    if (!global_msgs[prefs[message.author.id]]) prefs[message.author.id] = "en"
    let lang = prefs[message.author.id]
    const msg = global_msgs[lang]

    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    serverQueue.connection.playStream(ytdl(song.id))
        .on("end", reason => {
            serverQueue.songs.shift();
            playSong(guild, queue, serverQueue.songs[0], message)
        })
        .on("error", console.error)
        .setVolumeLogarithmic(serverQueue.volume / 250)
    serverQueue.textChannel.send((msg.music_videoplaying).replace("[SONG_TITLE]", song.title))
}
const ytsr = (url) => new Promise((resolve, reject) => ytsearch(url, (err, r) => err ? reject(err) : resolve(r)))
// Login
client.login(auth.token);
