const Discord = require("discord.js");
const fs = require("graceful-fs");
const ytdl = require("ytdl-core"),
    ytpl = require("ytpl"),
    ytsearch = require("yt-search"),
    { Util } = require("discord.js");
const config = require("../static/config.json"); 

module.exports.run = async (client, message, args) => {

  if (!message.member.roles.cache.find(role => config["dj_role"] === role.name)) return message.channel.send(client.msg["rejcted_dj"].replace("[ROLE_DJ]", config["dj_role"]));
  if (!message.member.voice.channel) return message.channel.send(client.msg["music_channel_undefined"])
  const serverQueue = client.queue.get(message.guild.id)
  if (!serverQueue) return message.channel.send(client.msg["music_queue_undefined"])
  
  
  return message.channel.send(["__**Song queue:**__",serverQueue.songs.map(song => "- " + song.title).join("\n"),"**Now playing:** " + serverQueue.songs[0].title].join("\n\n"))
}



module.exports.config = {
  name: "queue",
  aliases: ["songlist"],
  use: "queue",
  description: "Take a peek at the songs in the queue.",
  state : "gamma",
  page: 3
};




