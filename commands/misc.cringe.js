const Discord = require("discord.js");
const fs = require("graceful-fs");
const Canvas = require('canvas');

module.exports.run = async (client, message, args) => {
    try {
        /**
            @param {Array} [promisedMessages]
        */

        async function snapshot(promisedMessages) {
            let messages = await promisedMessages;
            const canvas = Canvas.createCanvas(1024, (messages.length) * 100);
            var ctx = canvas.getContext('2d');

            let looper = 0;
            messages.forEach(async (fetchedMessage) => {
                ctx.save();
                var avatar = await Canvas.loadImage(fetchedMessage.author.avatar)
                ctx.beginPath();
                ctx.arc(0 + 32 + 20, (messages.indexOf(fetchedMessage) * 100) + 32 + 20, 32, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(avatar, 0 + 20, (messages.indexOf(fetchedMessage) * 100) + 20);
                ctx.restore();
                ctx.save();

                ctx.font = `25px Whitney\\-Medium`;
                ctx.fillStyle = '#ffffff';
                ctx.fillText((fetchedMessage.author.name).replace("カミブルー！", "KAMI Blue"), 100, (messages.indexOf(fetchedMessage) * 100) + 40);

                ctx.font = `25px Whitney\\-Medium`;
                ctx.fillStyle = '#ffffff';
                ctx.fillText(fetchedMessage.content, 100, (messages.indexOf(fetchedMessage) * 100) + 72);

                if (looper == messages.length - 1) {
                    var attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'cringe.png');
                    message.channel.send(`📸 Cringe Comp!`, attachment);

                }

                looper++

            })

        }

        if (!args[0] || parseInt(args[0]) == NaN) return message.channel.send("You need to provide a valid number of messages to snapshot.");
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You do not have snapshot cringe.");

        let cringe = [];
        count = parseInt(args[0])+1;


        message.channel.messages.fetch({
            limit: count
        }).then(messages => {
            m = Object.fromEntries(messages);
            let looper = 0;
            messages.forEach(fetchedMessage => {
                cringe.push({
                    "author": {
                        "name": fetchedMessage.author.username,
                        "avatar": fetchedMessage.author.avatarURL({
                            format: "png",
                            size: 64
                        })
                    },
                    "content": fetchedMessage.content
                })
                if (looper == count - 1) return snapshot(cringe.slice(1).reverse());
                looper++
            })
        })
    } catch(idgaf) {
        // Do Nothing.
    }
}

module.exports.config = {
    name: "cringe",
    aliases: ["larp"],
    use: "cringe",
    description: "Take a screenshot of cringe. 📸",
    state: "gamma",
    page: 1
};
