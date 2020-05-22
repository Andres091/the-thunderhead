const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require('discord-economy');
const Canvas = require('canvas');

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
  } else devices += "Not Online";
  if (user.bot) devices = client.emotes["utility_bot"]; // BOT tag displays regardless

	let status;
	if (user.presence.status === "online") status = (`Online ${client.emotes["utility_online"]}`);
	else if(user.presence.status === "idle") status = (`Idle ${client.emotes["utility_idle"]}`);
	else if (user.presence.status === "dnd") status = (`Do Not Disturb ${client.emotes["utility_dnd"]}`);
	else if (user.presence.status === "offline") status = (`Offline ${client.emotes["utility_offline"]}`);
	else status = (`Offline ${client.emotes["utility_offline"]}`);
  if (user.presence.activities[0] && user.presence.activities[0].type === "STREAMING") status = `Streaming ${client.emotes["utility_live"]}`; 
  
  let statusBlock = [{ name: "​", value: "​", inline: true},{ name: "​", value: "​", inline: true},{ name: "​", value: "​", inline: true},{ name: "​", value: "​", inline: true}]; // You can be playing at least 2 games at once. This code accounts for 2 games. todo: make it account for infinite games.
  let thumbnail;


  try {
    let target = user.id;
    const canvas = Canvas.createCanvas(512, 512);
    const ctx = canvas.getContext('2d');
    const background = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${client.profile.get(target)["backdrop"]}.png?v=latest`);
    const darkener = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2Fdarkener.png`);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(darkener, 0, 0, canvas.width, canvas.height);

    if (target != "629799045954797609" && target != "710298364134293575") {
        const skin = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${client.profile.get(target)["skin"]}.png?v=latest`);
        const face = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${client.profile.get(target)["face"]}.png?v=latest`);
        const robe = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${client.profile.get(target)["robe"]}.png?v=latest`);
        const gem = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${client.profile.get(target)["gem"]}.png?v=latest`);
        const weapon = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${client.profile.get(target)["weapon"]}.png?v=latest`);
        ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(face, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(robe, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(gem, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(weapon, 0, 0, canvas.width, canvas.height);
    } else {
        const bot = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F512${target}.png?v=latest`);
        ctx.drawImage(bot, 0, 0, canvas.width, canvas.height);
    }
    
    thumbnail = new Discord.MessageAttachment(canvas.toBuffer(), 'scythe-avatar.png');
  } catch (err) {
    thumbnail = "";
  }





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