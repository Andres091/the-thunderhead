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
  if (!args[0]) return message.channel.send(client.msg["music_volume_resolved"].replace("[VOLUME]", serverQueue.volume));
  const volume = parseInt(args[0])
  serverQueue.volume = volume;
  serverQueue.connection.dispatcher.setVolumeLogarithmic(volume / 250);
  return message.channel.send(client.msg["music_volume_resolved"].replace("[VOLUME]", volume))
}



module.exports.config = {
  name: "volume",
  aliases: ["vol", "v"],
  use: "volume [Amount]",
  description: "Set the volume as a number from 0-100",
  state : "gamma",
  page: 3
};


