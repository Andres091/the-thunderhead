const Discord = require("discord.js");
const fs = require("graceful-fs");
const Canvas = require('canvas');
const profile = require("../dynamic/profiles.json");

module.exports.run = async (client, message, args  ) => {
  
    let target = message.author.id;
    if (args[0]) if (client.users.cache.get(args[0].replace(/[@!<>]/g, ""))) target = args[0].replace(/[@!<>]/g, "");

    if (!profile[target]) {
        profile[target] = {};
        message.channel.send(client.msg["profile_setup"]);
    }

    if (!profile[target]["skin"]) profile[target]["skin"] = "skin_olive";
    if (!profile[target]["face"]) profile[target]["face"] = "face_brown_default";
    if (!profile[target]["robe"]) profile[target]["robe"] = "robe_red";
    if (!profile[target]["gem"]) profile[target]["gem"] = "gem_none";
    if (!profile[target]["backdrop"]) profile[target]["backdrop"] = "backdrop_none";




    if (!args[0] || target != message.author.id) {
        const canvas = Canvas.createCanvas(512, 512);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${profile[target]["backdrop"]}.png?v=latest`);
        const darkener = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2Fdarkener.png`);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(darkener, 0, 0, canvas.width, canvas.height);

        if (target != "629799045954797609" && target != "704354866671124545") {
            const skin = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${profile[target]["skin"]}.png?v=latest`);
            const face = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${profile[target]["face"]}.png?v=latest`);
            const robe = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${profile[target]["robe"]}.png?v=latest`);
            const gem = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${profile[target]["gem"]}.png?v=latest`);
            ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(face, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(robe, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(gem, 0, 0, canvas.width, canvas.height);
        } else {
            const bot = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F512${target}.png?v=latest`);
            ctx.drawImage(bot, 0, 0, canvas.width, canvas.height);
        }


        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'scythe-avatar.png');

        message.channel.send(`Profile:`, attachment);
    } else {
        let toEdit = args[0].toLowerCase();
        let typeOf = args[1];

        // Face is split into two types: color and expression
        if (toEdit === "skin" || toEdit === "skincolor" || toEdit === "race") {
            if (!typeOf) return message.channel.send(client.msg["profile_invalid_skin"]);
            typeOf = typeOf.toLowerCase().replace("pale", "white");
            if (typeOf === "white" || typeOf === "olive" || typeOf === "tan" || typeOf === "brown") {
                profile[target]["skin"] = `skin_${typeOf}`;
                message.channel.send(client.msg["profile_set_skin"]);
            } else return message.channel.send(client.msg["profile_invalid_skin"]);

        } else if (toEdit === "robe" || toEdit === "frock" || toEdit === "clothing") {
            if (!typeOf) return message.channel.send(client.msg["profile_invalid_robe"]);
            typeOf = typeOf.toLowerCase();
            if (typeOf === "red" || typeOf === "orange" || typeOf === "yellow" || typeOf === "lime" || typeOf === "green" || typeOf === "turquoise" ||
                typeOf === "blue" || typeOf === "lavender" || typeOf === "purple" || typeOf === "tonist" || typeOf === "black" || typeOf === "white") {
                profile[target]["robe"] = `robe_${typeOf}`;
                message.channel.send(client.msg["profile_set_robe"]);
            } else return message.channel.send(client.msg["profile_invalid_robe"]);

        } else if (toEdit === "gem" || toEdit === "gems" || toEdit === "jewels") {
            if (!typeOf) return message.channel.send(client.msg["profile_invalid_gem"]);
            typeOf = typeOf.toLowerCase();
            if (typeOf == "blue" || typeOf == "green" || typeOf == "purple" || typeOf == "red" || typeOf == "white" || typeOf == "yellow") {
                profile[target]["gem"] = `gem_${typeOf}`;
            } else profile[target]["gem"] = `gem_none`;
            message.channel.send(client.msg["profile_set_gem"]);

        } else if (toEdit === "expression" || toEdit === "emotion" || toEdit === "face") {
            if (!typeOf) return message.channel.send(client.msg["profile_invalid_face"]);
            typeOf = typeOf.toLowerCase().replace("angry", "anger").replace("blushing", "blush").replace("normal", "default");
            if (typeOf === "anger" || typeOf === "blush" || typeOf === "serious" || typeOf === "default") {
                let faceArgs = (profile[target]["face"]).split("_");
                faceArgs[2] = typeOf;
                profile[target]["face"] = faceArgs.join("_");
                message.channel.send(client.msg["profile_set_face"])
            } else return message.channel.send(client.msg["profile_invalid_face"]);

        } else if (toEdit === "hair" || toEdit === "hairs" || toEdit === "head") {
            if (!typeOf) return message.channel.send(client.msg["profile_invalid_hair"]);
            typeOf = typeOf.toLowerCase();
            if (typeOf === "black" || typeOf === "brown" || typeOf === "green" || typeOf === "red" || typeOf === "white" || typeOf === "yellow") {
                let faceArgs = (profile[target]["face"]).split("_");
                faceArgs[1] = typeOf;
                profile[target]["face"] = faceArgs.join("_");
                message.channel.send(client.msg["profile_set_hair"])
            } else return message.channel.send(client.msg["profile_invalid_hair"]);

        } else if (toEdit === "backdrop" || toEdit === "background" || toEdit === "enviroment") {
            if (!typeOf) return message.channel.send(client.msg["profile_invalid_backdrop"]);
            typeOf = typeOf.toLowerCase();
            if (typeOf == "red" || typeOf == "green" || typeOf == "turquoise" || typeOf == "dream" || typeOf == "incorrect" || typeOf == "correct") {
                profile[target]["backdrop"] = `backdrop_${typeOf}`;
            } else profile[target]["backdrop"] = `backdrop_none`;
            message.channel.send(client.msg["profile_set_backdrop"]);

        } else return message.channel.send(client.msg["profile_invalid"]);

    }

} 

module.exports.config = {
  name: "profile",
  aliases: [],
  use: "profile {[@User]/Category} {Value}",
  description: "Make a scythely avatar! Categories: Robe, Hair, Background, Skin, Face, and Gems",
  state : "beta",
  page: 1
};