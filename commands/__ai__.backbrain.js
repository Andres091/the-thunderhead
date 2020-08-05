const Discord = require("discord.js");
const fs = require("graceful-fs");
const spawn = require("child_process").spawn;



module.exports.run = async (client, message, args  ) => {
  if (message.guild.id !== "625021277295345667") return;
  const pythonProcess = spawn('python3', [__dirname + "/__ai__/generate.py"]); // python3; the thunderhead is hosted on a linux thingy!!!
  message.channel.send("Generating Text... Please be patient. DM-ing you the details")
  pythonProcess.stderr.on('data', (data) => {
    message.author.send(data.toString());
});
  pythonProcess.stdout.on('data', (data) => {
    message.reply(data.toString())
});
  
} 

module.exports.config = {
  name: "backbrain",
  aliases: [],
  use: "backbrain",
  description: "A highly expirimental command that involes neural networks to generate lines of text, the training data of which is the novel, Scythe.",
  state : "beta",
  page: -1
};
