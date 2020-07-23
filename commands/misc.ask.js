const Discord = require("discord.js");
const fs = require("graceful-fs");
const Canvas = require('canvas');
const mexp = require('math-expression-evaluator');
const cosmetic = require("../static/cosmetic.json"); 

module.exports.run = async (client, message, args) => {
  
    let expVal;
    let maybeViolate = message.content;
    try {
        expVal = (mexp.eval(args.join(" ").replace("@", "\\@").replace(/sqrt/g, 'root').replace(/[÷]/g, "/").replace(/[xX]/g, "*").replace(/[`]/g, ""))).toString();
    } catch (err) {
      console.log(err);
    }

    if (0 <= maybeViolate.toLowerCase().indexOf("scythe") || 0 <= maybeViolate.toLowerCase().indexOf("$cythe")) {
        message.channel.send(`You asked: *${args.join(" ")}*`, {
            files: [cosmetic.ask_warn]
        });
    } else if (expVal) {
        const canvas = Canvas.createCanvas(600, 600);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage('https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2Fyes600x600.png');
        await ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.font = '80px sans-serif';
        ctx.fillStyle = '#f3f0cd';
        ctx.textAlign = 'center';
        ctx.fillText((Math.round(expVal * 1000) / 1000), canvas.width / 2, canvas.height / 2.2);
        message.channel.send(`Expression: \`${args.join(" ").replace(/root/g, 'sqrt').replace(/[/]/g, "÷").replace(/[*]/g, "x")}\``, {
            files: [canvas.toBuffer()]
        });
    } else {
        var scytheRandom = Math.floor(Math.random() * cosmetic.ask_answers.length);
        message.channel.send(`You asked: *${args.join(" ")}*`, {
            files: [cosmetic.ask_answers[scytheRandom]]
        });
    }
  
} 

module.exports.config = {
  name: "ask",
  aliases: [],
  use: "ask [Question/Math]",
  description: "Ask me a question, and I will answer with the truth.",
  state : "gamma",
  page: 1
};
