const Discord = require("discord.js");
const fs = require("graceful-fs");
const ytdl = require("ytdl-core"),
    ytpl = require("ytpl"),
    ytsearch = require("yt-search"),
    { Util } = require("discord.js");
const config = require("../static/config.json"); 
const cosmetic = require("../static/cosmetic.json"); 

module.exports.run = async (client, message, args) => {

  if (!message.member.roles.cache.find(role => config["dj_role"] === role.name)) return message.channel.send(client.msg["rejcted_dj"].replace("[ROLE_DJ]", config["dj_role"]));
  if (!message.member.voice.channel) return message.channel.send(client.msg["music_channel_undefined"])
  const serverQueue = client.queue.get(message.guild.id)
  if (!serverQueue) return message.channel.send(client.msg["music_queue_undefined"])
  
  
  let volumeValue = (cosmetic["volume_list"][(Math.round(serverQueue.volume / 20)) - 1])
  if (!volumeValue) volumeValue = "Thunderhead Music";

  let musicEmbed = new Discord.MessageEmbed()
    .setTitle("Music")
    .setThumbnail(serverQueue.songs[0].thumbnail)
    .setFooter(volumeValue, "https://cdn.glitch.com/967bdf25-e9cb-4a1f-bdb5-a102880988a9%2FMusic%20Icon.png")
    .setDescription(`ɴᴏᴡ ᴘʟᴀʏɪɴɢ \n **${serverQueue.songs[0].title}**`)
    .setColor(client.colors["discord"])

  return message.channel.send(musicEmbed);}



module.exports.config = {
  name: "nowplaying",
  aliases: ["np", "current", "song"],
  use: "queue",
  description: "View the current song.",
  state : "gamma",
  page: 3
};
