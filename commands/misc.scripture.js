const Discord = require("discord.js");
const fs = require("graceful-fs");


module.exports.run = async (client, message, args  ) => {
  
    let wisdoms = ["Hear now, all who can discern true from fact, the indisputable account of the Toll, called forth from the beginning of time by the Great Resonance to walk among us, the Tone made flesh, in order to link us, the lost chosen, to the harmony from which we have fallen. Thus it came to pass in the Year of the Raptor that the Tone heralded a new era with a call heard round the world, and in that glorious moment breathed life into the mind-machine of humankind, making it a thing divine, and completing the sacred Triad of Tone, Toll, and Thunder. **All rejoice!**",
        "His seat of mercy rested at the mouth of Lenape, and there he would proclaim the truth of the Tone. Awesome was he in his splendor, such that even the slightest whisper from his lips would peal like thunder. Those who experienced his presence were changed forever and went out into the world with new purpose, and to those who doubted, he offered forgiveness. Forgiveness even for a bringer of death, for whom he did sacrifice his life, in his youth, only to rise again.**All rejoice!**",
        "The sanctimonious Sibilants who would wage unwarranted war were an abomination to the Toll. He would descend on them as the furious beating of a million wings, and the skies would rage with Thunder. The unrepentant would be struck down, but those who fell to their knees would be spared. Then he would leave them, dissolving once more into a storm of feathers and disappearing to the calming sky. **All rejoice!**",
        "\"Rise!\u201D the Toll called, amid the fearsome Thunder. \u201CRise and leave this place behind, for I have set a place for you on high.\u201D Then the Toll stood in the ring of fire, and, arms outstretched in the brimstone flames, he raised us up to the womb of Heaven, where we slept until the Tone called to us to be reborn, never to forget that the Toll remained in the Place Behind so that he might bring hope and intone songs of healing to that ancient wounded world. **All rejoice!**"]
    let scriptEmbed = new Discord.MessageEmbed()
    .addField("Scripture", wisdoms[Math.floor(Math.random() * wisdoms.length)])
    .setColor(client.colors["discord"]);
    message.channel.send(scriptEmbed);
    
  
} 

module.exports.config = {
  name: "scripture",
  aliases: [],
  use: "nod",
  description: "Outputs Curate and Synphonia analysis thingy.",
  state : "gamma",
  page: -1
};