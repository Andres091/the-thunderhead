const Discord = require("discord.js");
const fs = require("graceful-fs");
const ytdl = require("ytdl-core"),
    ytpl = require("ytpl"),
    ytsearch = require("yt-search"),
    { Util } = require("discord.js");
const config = require("../static/config.json"); 
const cosmetic = require("../static/cosmetic.json"); 
const msgs = require("../static/msgs.json"); 

module.exports.run = async (client, message, args) => {
  if (!message.member.roles.cache.find(role => config["dj_role"] === role.name)) return message.channel.send(client.msg["rejcted_dj"].replace("[ROLE_DJ]", config["dj_role"]));
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send(client.msg["music_channel_undefined"])
    const url = args.join(" ")
    if (url.includes("list=")) {
        const playlist = await ytpl(url.split("list=")[1])
        const videos = playlist.items;
        message.channel.send(client.msg["music_playlist_success"].replace("[PLAYLIST_TITLE]", `${playlist.title} (${videos.length})`))
        for (const video of videos) await queueSong(video, message, voiceChannel, client.queue)
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
                    (client.msg["music_video_pending"]).replace("[LIST_LENGTH]", videos.length)
                ].join("\n\n"))
              
             let response;
                try {
                        response = await message.channel.awaitMessages(msg => 0 < msg.content && msg.content < videos.length + 1 && msg.author.id == message.author.id, {
                            max: 1,
                            time: 1e4,
                            errors: ['time']
                        });
                  
                        const videoIndex = parseInt(response.first().content)
                        video = await ytdl.getBasicInfo(videos[videoIndex - 1].videoId)
                    } catch (e) {
                        return message.channel.send(client.msg["music_video_rejected"]);
                    }
                    
                   

            } catch (e) {
                console.log(e)
                return message.channel.send(client.msg["music_video_undefined"])
            }
        }
        await message.channel.send(client.msg["music_video_success"].replace("[VIDEO_TITLE]", `${video.title}`))
        return await queueSong(video, message, voiceChannel, client.queue)
    }
  
} 



module.exports.config = {
  name: "play",
  aliases: ["sing"],
  use: "play [Song]",
  description: "When used it will yield ten search results, simply type a number from 1-10 of which song should be played.",
  state : "gamma",
  page: 3
};





//Async - Music
async function queueSong(video, message, voiceChannel, queue) {



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
            message.channel.send(msgs["music_rejected"])
            return queue.delete(message.guild.id)
        }
    } else serverQueue.songs.push(song);
    return;
}
async function playSong(guild, queue, song, message) {



    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    serverQueue.connection.play(ytdl(song.id))
        .on("end", reason => {
            serverQueue.songs.shift();
            playSong(guild, queue, serverQueue.songs[0], message)
        })
        .on("error", console.error)
        .setVolumeLogarithmic(serverQueue.volume / 250)
    serverQueue.textChannel.send(msgs["music_video_resolved"].replace("[SONG_TITLE]", song.title))
}
const ytsr = (url) => new Promise((resolve, reject) => ytsearch(url, (err, r) => err ? reject(err) : resolve(r)))