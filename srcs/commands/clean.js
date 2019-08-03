const Cmd = require("../class/cmd.js");

var name = "clean";

var description = "**Efface** les message envoyés par **OverLead**.";

var func = function (message, extra)
{
    message.channel.fetchMessages({limit: 100}).then(messages => {
        const botMessages = messages.filter(msg => msg.author.bot);
        const cmdMessages = messages.filter(msg => msg.content.startsWith(extra.botInfos.prefix));
        extra.botInfos.log(botMessages.array().length + " messages du bot vont être effacés.");
        extra.botInfos.log(cmdMessages.array().length + " message de commandes vont être effacés.");
        message.channel.bulkDelete(botMessages).catch(err => extra.botInfos.log("Erreur lors du bulkDelete des botMessages : " + err));
        message.channel.bulkDelete(cmdMessages).catch(err => extra.botInfos.log("Erreur lors du bulkDelete des cmdMessages : " + err));
        //message.channel.send("C'est nettoyé ! \:sunglasses:");
    }).catch(err => extra.botInfos.log("Erreur lors du fetch des message pour le *clean* : " + err));
    return (0);
}

var clean = new Cmd(name, description, func);

module.exports = clean;