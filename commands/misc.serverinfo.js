const Discord = require("discord.js");
const fs = require("graceful-fs");
module.exports.run = async (client, message, args) => {
	
  function checkDays(date) {
		let now = new Date();
		let lapsed = now.getTime() - date.getTime();
		let days = Math.floor(lapsed / 86400000);
		return days + (days == 1 ? " day" : " days") + " ago";
	};
	
  let discordGuildVerificationLevels = { // Used to be an integer, now I'm a string 😔
    "NONE": "None", 
    "LOW": "Low", 
    "MEDIUM": "Medium", 
    "HIGH": "(╯°□°）╯︵  ┻━┻", 
    "VERY_HIGH": "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"
  };
  
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
	const serverEmbed = new Discord.MessageEmbed()
  .setAuthor(message.guild.name, message.guild.iconURL)
  .addField("Name", message.guild.name, true)
  .addField("ID", message.guild.id, true)
  .addField("Owner",`${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`, true)
  .addField("Region", region[message.guild.region], true)
  .addField("Total | Humans | Bots", `${message.guild.members.cache.size} | ${message.guild.members.cache.filter(member => !member.user.bot).size} | ${message.guild.members.cache.filter(member => member.user.bot).size}`, true)
  .addField("Verification Level", discordGuildVerificationLevels[message.guild.verificationLevel], true)
  .addField("Channels", message.guild.channels.cache.size, true) // todo: filter out categories 
  .addField("Roles", message.guild.roles.cache.size, true)
  .addField("Creation Date", `${message.channel.guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(message.channel.guild.createdAt)})`, true)
  .setColor(client.colors["discord"]).setThumbnail(message.guild.iconURL({size:512,dynamic:true}));

  message.channel.send(serverEmbed);
}
module.exports.config = {
	name: "serverinfo",
	aliases: ["server"],
	use: "serverinfo",
	description: "Find out more about this server",
	state: "gamma",
	page: 1
};