const Cmd = require("../class/cmd.js");

var name = "clean";

var description = "**Efface** les message envoyés par **Sady**.";

var func = function (message, extra)
{
    message.channel.fetchMessages({limit: 100}).then(messages => {
        const botMessages = messages.filter(msg => msg.author.bot);
        const cmdMessages = messages.filter(msg => msg.content.startsWith(extra.botInfos.prefix));
        console.log(botMessages.array().length + " messages du bot vont être effacés.");
        console.log(cmdMessages.array().length + " message de commandes vont être effacés.");
        message.channel.bulkDelete(botMessages);
        message.channel.bulkDelete(cmdMessages);
        //message.channel.send("C'est nettoyé ! \:sunglasses:");
    }).catch(err => {
        console.log(err);
    });
    return (0);
}

var clean = new Cmd(name, description, func);

module.exports = clean;