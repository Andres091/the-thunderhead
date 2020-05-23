const Discord = require("discord.js");
const fs = require("graceful-fs");
const Canvas = require('canvas');

module.exports.run = async (client, message, args) => {
  
    let target = message.author.id;
    if (args[0]) if (client.users.cache.get(args[0].replace(/[@!<>]/g, ""))) target = args[0].replace(/[@!<>]/g, "");

    if (!client.profile.get(target)) (client.profile.set((target), {"backdrop": "backdrop_red"})) && (message.channel.send(client.msg["profile_setup"])); // && statements, snazzy.

    if (!client.profile.get(target)["skin"]) client.profile.set(target, "skin_olive" ,"skin"); //todo: fix
    if (!client.profile.get(target)["face"]) client.profile.set(target, "face_brown_default", "face");
    if (!client.profile.get(target)["robe"]) client.profile.set(target, "robe_red", "robe");
    if (!client.profile.get(target)["gem"]) client.profile.set(target, "gem_none", "gem");
    if (!client.profile.get(target)["backdrop"]) client.profile.set(target, "backdrop_none", "backdrop");
    if (!client.profile.get(target)["weapon"]) client.profile.set(target, "weapon_none", "weapon");




    if (!args[0] || target != message.author.id) {
        const canvas = Canvas.createCanvas(512, 512);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${client.profile.get(target)["backdrop"]}.png?v=latest`);
        const darkener = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2Fdarkener.png`);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(darkener, 0, 0, canvas.width, canvas.height);

        if (target != "629799045954797609" && target != "710298364134293575") {
            const skin = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${client.profile.get(target)["skin"]}.png?v=latest`);
            const face = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${client.profile.get(target)["face"]}.png?v=latest`);
            const robe = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${client.profile.get(target)["robe"]}.png?v=latest`);
            const gem = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${client.profile.get(target)["gem"]}.png?v=latest`);
            const weapon = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2F${client.profile.get(target)["weapon"]}.png?v=latest`);
            let HOUSE = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2Fundefined.png?v=latest`);
            if (client.users.cache.get(target).flags.toArray().includes("HOUSE_BRILLIANCE")) HOUSE = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2FHOUSE_BRILLIANCE.png?v=latest`); //also doubles as a hypesquad tierlist :)))
            if (client.users.cache.get(target).flags.toArray().includes("HOUSE_BALANCE")) HOUSE = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2FHOUSE_BALANCE.png?v=latest`);
            if (client.users.cache.get(target).flags.toArray().includes("HOUSE_BRAVERY")) HOUSE = await Canvas.loadImage(`https://cdn.glitch.com/8d7ee13d-7445-4225-9d61-e264d678640b%2FHOUSE_BRAVERY.png?v=latest`);
            ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(face, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(robe, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(gem, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(weapon, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(HOUSE, 0, 0, canvas.width, canvas.height);
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
                client.profile.set(target, `skin_${typeOf}`, "skin");
                message.channel.send(client.msg["profile_set_skin"]);
            } else return message.channel.send(client.msg["profile_invalid_skin"]);

        } else if (toEdit === "robe" || toEdit === "frock" || toEdit === "clothing") {
            if (!typeOf) return message.channel.send(client.msg["profile_invalid_robe"]);
            typeOf = typeOf.toLowerCase();
            if (typeOf === "red" || typeOf === "orange" || typeOf === "yellow" || typeOf === "lime" || typeOf === "green" || typeOf === "turquoise" ||
                typeOf === "blue" || typeOf === "lavender" || typeOf === "purple" || typeOf === "tonist" || typeOf === "black" || typeOf === "white") {
                    client.profile.set(target, `robe_${typeOf}`, "robe");
                message.channel.send(client.msg["profile_set_robe"]);
            } else return message.channel.send(client.msg["profile_invalid_robe"]);

        } else if (toEdit === "gem" || toEdit === "gems" || toEdit === "jewels") {
            if (!typeOf) return message.channel.send(client.msg["profile_invalid_gem"]);
            typeOf = typeOf.toLowerCase();
            if (typeOf == "blue" || typeOf == "green" || typeOf == "purple" || typeOf == "red" || typeOf == "white" || typeOf == "yellow") {
                client.profile.set(target, `gem_${typeOf}`, "gem");
            } else client.profile.set(target, `gem_none`, "gem");
            message.channel.send(client.msg["profile_set_gem"]);

        } else if (toEdit === "expression" || toEdit === "emotion" || toEdit === "face") {
            if (!typeOf) return message.channel.send(client.msg["profile_invalid_face"]);
            typeOf = typeOf.toLowerCase().replace("angry", "anger").replace("blushing", "blush").replace("normal", "default");
            if (typeOf === "anger" || typeOf === "blush" || typeOf === "serious" || typeOf === "default") {
                let faceArgs = (client.profile.get(target)["face"]).split("_");
                faceArgs[2] = typeOf;
                client.profile.set(target, faceArgs.join("_"),"face" );
                message.channel.send(client.msg["profile_set_face"])
            } else return message.channel.send(client.msg["profile_invalid_face"]);

        } else if (toEdit === "hair" || toEdit === "hairs" || toEdit === "head") {
            if (!typeOf) return message.channel.send(client.msg["profile_invalid_hair"]);
            typeOf = typeOf.toLowerCase();
            if (typeOf === "black" || typeOf === "brown" || typeOf === "green" || typeOf === "red" || typeOf === "white" || typeOf === "yellow") {
                let faceArgs = (client.profile.get(target)["face"]).split("_");
                faceArgs[1] = typeOf;
                client.profile.set(target,faceArgs.join("_"),"face" );
                message.channel.send(client.msg["profile_set_hair"])
            } else return message.channel.send(client.msg["profile_invalid_hair"]);

        } else if (toEdit === "backdrop" || toEdit === "background" || toEdit === "enviroment") {
            if (!typeOf) return message.channel.send(client.msg["profile_invalid_backdrop"]);
            typeOf = typeOf.toLowerCase();
            if (typeOf === "red" || typeOf === "green" || typeOf === "turquoise" || typeOf === "dream" || typeOf === "incorrect" || typeOf === "correct") {
                client.profile.set(target, `backdrop_${typeOf}`, "backdrop");
            } else client.profile.set(target, `backdrop_none`,"backdrop" ); //  Can't tell if I made this a glitch or a feature. At this point, I'm too scared to ask...
            message.channel.send(client.msg["profile_set_backdrop"]); 

        } else if (toEdit === "weapon" || toEdit === "weapons") {
            if (!typeOf) return message.channel.send(client.msg["profile_invalid_weapon"]);
            typeOf = typeOf.toLowerCase().replace("gun", "pistol").replace("knife", "dagger").replace("blade", "sword").replace("flamethrower", "fire").replace("fire", "flame");
            if (typeOf === "scythe" || typeOf === "pistol" || typeOf === "dagger" || typeOf === "sword" || typeOf === "flame" || typeOf === "none") {
                client.profile.set(target, `weapon_${typeOf}`, "weapon")
                message.channel.send(client.msg["profile_set_weapon"]);
            } else return message.channel.send(client.msg["profile_weapon_invalid"])
        }
        else return message.channel.send(client.msg["profile_invalid"]);

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