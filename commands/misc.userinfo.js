const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require('discord-economy');

module.exports.run = async (client, message, args) => {
	if(!args[0]) return message.channel.send(client.msg["userinfo_undefined"]);
	let user = client.users.cache.get(args[0].replace(/[@!<>]/g, ""));
	if(!user) return message.channel.send(client.msg["userinfo_invalid"]);
  
	
  var userBalance = await eco.FetchBalance(user.id);
  userBalance = userBalance.balance;
  
  let devices = " ";
	let guildNickname;
  let guildJoinDate = client.msg["userinfo_not_in_guild"];
  
  const userJoinDate = `${user.createdAt.getDate()+1}-${user.createdAt.getMonth()+1}-${user.createdAt.getFullYear()} @ ${user.createdAt.getHours()}:${user.createdAt.getMinutes()}:${user.createdAt.getSeconds()}`;
	if (message.guild.member(user)) (guildJoinDate = `${message.guild.member(user).joinedAt.getDate()+1}-${message.guild.member(user).joinedAt.getMonth()+1}-${message.guild.member(user).joinedAt.getFullYear()} @ ${message.guild.member(user).joinedAt.getHours()}:${message.guild.member(user).joinedAt.getMinutes()}:${message.guild.member(user).joinedAt.getSeconds()}`) && (guildNickname = message.guild.member(user).nickname || user.username);
	
	
  let game = user.presence.activities;
  if (user.presence.clientStatus) {
  if (user.presence.clientStatus["desktop"]) devices += `Desktop ${client.emotes["utility_desktop"]}\n`;
  if (user.presence.clientStatus["mobile"]) devices += `Mobile ${client.emotes["utility_mobile"]}\n`; 
  if (user.presence.clientStatus["web"]) devices += `Web ${client.emotes["utility_web"]}\n`;
  } else if (user.bot) devices = client.emotes["utility_bot"]; else devices = "Not Online";
  
	let status;
	if (user.presence.status === "online") status = (`Online ${client.emotes["utility_online"]}`);
	else if(user.presence.status === "idle") status = (`Idle ${client.emotes["utility_idle"]}`);
	else if (user.presence.status === "dnd") status = (`Do Not Disturb ${client.emotes["utility_dnd"]}`);
	else if (user.presence.status === "offline") status = (`Offline ${client.emotes["utility_offline"]}`);
	else status = (`Offline ${client.emotes["utility_offline"]}`);
  if (user.presence.activities[0] && user.presence.activities[0].type === "STREAMING") status = `Streaming ${client.emotes["utility_live"]}`; 
  
  let statusBlock = [{ name: "​", value: "​", inline: true},{ name: "​", value: "​", inline: true},{ name: "​", value: "​", inline: true}];
  let thumbnail;
  if (user.presence.activities) { 
    for (const activityIndex in user.presence.activities) {
      const activity = user.presence.activities[activityIndex];
      let presenceName;
      let presenceDetails;
      let emoji;
      presenceName = (activity.name);
      
      if (activity.details) presenceDetails = activity.detais;
      if (presenceName === "Custom Status") {
        if (activity.emoji) {
          emoji = `${activity.emoji.name}`;
          if (activity.emoji.id) emoji = `<${(activity.emoji.animated).toString().replace(true, "a").replace("false", "")}:${activity.emoji.name}:${activity.emoji.id}>`;
        }
        presenceDetails = (emoji || "") + " " + (activity.state || "");
      } else if (presenceName === "Spotify") {
        thumbnail = `${activity.assets.largeImage}`.replace("spotify:", "https://i.scdn.co/image/");
        presenceDetails = `${activity.details} by ${activity.state} on ${activity.assets.largeText}`;
      } else (presenceName = (activity.type).toLowerCase().charAt(0).toUpperCase() + (activity.type).toLowerCase().slice(1)) && (presenceDetails = activity.name);
      
      if (activity.assets && activity.type === "PLAYING" && activity.assets.largeImage) thumbnail = `https://cdn.discordapp.com/app-assets/${activity.applicationID}/${activity.assets.largeImage}.png`;
      
      (statusBlock[activityIndex]["name"] = presenceName) && (statusBlock[activityIndex]["value"] = presenceDetails);
    }
  } else (statusBlock[0]["name"] = "Activity") && (statusBlock[0]["value"] = "Nothing");
  let userinfoEmbed = new Discord.MessageEmbed()
    .setAuthor(`${user.username}`, user.avatarURL({dynamic:true}))
    .setTitle("User Info")
    	.addFields(
        { name: "Joined Discord", value: userJoinDate, inline: true },
        { name: "Joined Server", value: guildJoinDate, inline: true },
        { name: "Username", value: user.username, inline: true},
        { name: "Nickname", value: guildNickname, inline: true},
        { name: "Tag", value: user.discriminator, inline: true},
        { name: "Mention", value: `<@!${user.id}>`, inline: true},
        { name: "Discord Id", value: user.id, inline: true},
        { name: "Status", value: status, inline: true},
        { name: "Devices Online", value: devices, inline: true},
        { name: "Balance", value: userBalance + client.emotes["currency_vibes"], inline: true},
        
        statusBlock,
	  )
    .setThumbnail(thumbnail)
    .setFooter("Thunderhead Backbrain", client.user.avatarURL())
    .setColor(client.colors["discord"]);
  
  message.channel.send(userinfoEmbed);
}

module.exports.config = {
	name: "userinfo",
	aliases: ["info", "about", "whois"],
	use: "userinfo [@User]",
	description: "Find out more about a user",
	state: "gamma",
	page: 1
};