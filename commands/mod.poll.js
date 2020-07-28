const Discord = require("discord.js");
const fs = require("graceful-fs");
const ms = require('ms');
const discordEmojiRegex = new RegExp("(<:.+?:\\d+>)")
const unicodeEmojiRegex = new RegExp("(\\u00a9|\\u00ae|\[\\u2000-\\u3300\]|\\ud83c\[\\ud000-\\udfff\]|\\ud83d\[\\ud000-\\udfff\]|\\ud83e\[\\ud000-\\udfff\])")

module.exports.run = async(client, message, args) => {
    let requiredPermission = "MANAGE_MESSAGES";
    if (!message.member.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_user_permission_" + requiredPermission]);
    if (!message.guild.me.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_client_permission_" + requiredPermission]);
    requiredPermission = "EMBED_LINKS";
    if (!message.member.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_user_permission_" + requiredPermission]);
    if (!message.guild.me.hasPermission(requiredPermission)) return message.channel.send(client.msg["rejected_client_permission_" + requiredPermission]);

    var reactTimeLimit;
    var argPoint;
    var reactionsArray = []; //init array
    var poll;

    args.forEach(arg => {
        try {
            reactTimeLimit = ms(ms(arg), {
                long: true
            });
            argPoint = args.indexOf(arg);
        } catch {
            if (unicodeEmojiRegex.test(arg)) {
              if ((reactionsArray.indexOf(arg)) == -1) reactionsArray.push(arg); // some smartasses would put the emojis w/o a space
            } else if (discordEmojiRegex.test(arg)) {
              var discordEmoji = client.emojis.cache.get(arg.split(":")[2].replace(/[:<>]/g, ""))
                if (discordEmoji != undefined) {
                    if ((reactionsArray.indexOf(discordEmoji.id)) == -1) reactionsArray.push(discordEmoji.id);
                }
            }
        }
    });

    poll = args.slice(argPoint + 1).join(" ");
    if (ms(args[argPoint]) == undefined) return;

    let pollEmbed = new Discord.MessageEmbed()
      .setColor(client.colors["discord"])
      .setTitle("Poll")
      .setDescription(poll)
      .setFooter(`The poll will end ${reactTimeLimit} after initialization.`)

    const pollMessage = await message.channel.send(pollEmbed);
    reactionsArray.forEach(async emoji => {
      await pollMessage.react(emoji);
    })



  setTimeout(() => {
      let neoPollEmbed = new Discord.MessageEmbed()
      .setColor(client.colors["thunderhead"])
      .setTitle("Poll Results")
      .setDescription(poll) 
      .setFooter("Results down below:")
      pollMessage.edit(neoPollEmbed);
  }, ms(args[argPoint]));

// todo: actual poll result display

};

module.exports.config = {
    name: "poll",
    aliases: [],
    use: "poll [Emoji]*{However many emojis you want} [Time] [Poll]",
    description: "Create a poll!",
    state: "gamma",
    page: 4
};
