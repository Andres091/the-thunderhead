const Discord = require("discord.js");
const fs = require("graceful-fs");
var eco = require('discord-economy');
const Canvas = require('canvas');

module.exports.run = async (client, message, args) => {
  let requiredPermission = "ATTACH_FILES"; 
  if (!message.member.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_user_permission_"+requiredPermission]);
  if (!message.guild.me.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_client_permission_"+requiredPermission]);
  
  
  var userToCheck = message.mentions.members.first();
  userToCheck = userToCheck ? userToCheck.user : message.author;
  var output = await eco.FetchBalance(userToCheck.id);
  let balText = `Balance: ${output.balance}`;
  let font = "Calibri"
  if (!client.profile.get(userToCheck.id)) client.profile.set(userToCheck.id, {}); // Quietly sets up profile.
  if (!client.profile.get(userToCheck.id)["backdrop"]) client.profile.set(userToCheck.id, "backdrop_none", "backdrop");

  const canvas = Canvas.createCanvas(400, 160);
  const ctx = canvas.getContext('2d');
  const background = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${client.profile.get(userToCheck.id)["backdrop"]}.png?v=latest`);
  const darkener = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2Fdarkener.png`);
  const currencyIcon = await Canvas.loadImage(`https://cdn.discordapp.com/emojis/${(client.emotes["currency_vibes"]).split(":")[2].split(">")[0]}.png`);
  await ctx.drawImage(background, 0, 0, 400, 160);
  await ctx.drawImage(darkener, 0, 0, 400, 160);
  ctx.font = `15px ${font}`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText((userToCheck.username), canvas.width / 4.2, canvas.height / 2.5);
  ctx.font = `30px ${font}`;
  ctx.fillText((balText), canvas.width / 4.2, canvas.height / 1.7);
  ctx.drawImage(currencyIcon, (260 + ((balText.length-10)*18)), 72, canvas.height / 6, canvas.height / 6);
  ctx.beginPath();
  ctx.arc(50, 75, canvas.height / 5.5, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();
  const avatar = await Canvas.loadImage(userToCheck.avatarURL({format: "png", size: 256}));
  ctx.drawImage(avatar, 20, 40, canvas.height / 2.5, canvas.height / 2.5);
  const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'balance.png');
  message.channel.send(attachment);
} 

module.exports.config = {
  name: "balance",
  aliases: ["bal", "bank", "vibecheck"],
  use: "balance [@User]",
  description: "Check your, or another users, balance.",
  state : "gamma",
  page: 2
};