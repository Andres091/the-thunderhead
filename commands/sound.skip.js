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
    serverQueue.playing = false
    await message.channel.send(client.msg["music_skip_success"])
    serverQueue.connection.dispatcher.end();
    
}



module.exports.config = {
  name: "skip",
  aliases: [],
  use: "skip",
  description: "Skips the song currently playing.",
  state : "gamma",
  page: 3
};



