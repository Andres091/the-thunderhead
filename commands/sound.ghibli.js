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
 
  
  var url = "https://www.youtube.com/watch?v=EmRi0Z7tdTY"
  var video = await ytdl.getBasicInfo(url)
  await message.channel.send(client.msg["music_video_success"].replace("[VIDEO_TITLE]", `${video.title}`))
  return await queueSong(video, message, message.member.voice.channel, client.queue, client)
}



module.exports.config = {
  name: "ghibli",
  aliases: [],
  use: "ghibli",
  description: "Plays ghibli music.",
  state : "gamma",
  page: -1
};




//Async - Music
async function queueSong(video, message, voiceChannel, queue, client) {



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
            playSong(message.guild, queue, queueConstruct.songs[0], message, client)
        } catch (e) {
            console.log(e)
            message.channel.send(client.msg["music_rejected"])
            return queue.delete(message.guild.id)
        }
    } else serverQueue.songs.push(song);
    return;
}
async function playSong(guild, queue, song, message, client) {



    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    serverQueue.connection.play(ytdl(song.id))
        .on("end", reason => {
            serverQueue.songs.shift();
            playSong(guild, queue, serverQueue.songs[0], message, client)
        })
        .on("error", console.error)
        .setVolumeLogarithmic(serverQueue.volume / 250)
    serverQueue.textChannel.send(client.msg["music_video_resolved"].replace("[SONG_TITLE]", song.title))
}
const ytsr = (url) => new Promise((resolve, reject) => ytsearch(url, (err, r) => err ? reject(err) : resolve(r)))