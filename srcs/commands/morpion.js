const Cmd = require("../class/cmd.js");
const Morpion = require("../class/morpion.js");
const BotInfos = require("../bot_infos.js");

var bInfs = new BotInfos();

var name = "morpion";

var description = "Lance une partie de **Morpion**, permet de **jouer si une partie est déjà lancée** en entrant des coordonnées **y,x**, ou **new** pour redémarrer la partie.\n";
description += "La partie est **commune à tous les serveurs**, si vous voyez quelqu'un lancer une partie, **n'hésitez pas jouer** ! \:smile:\n";
description += "Vous pouvez également participer à l'échange en commentant la partie en direct en tapant : **" + bInfs.prefix + name + " send __votre message__** !";

var func = function (message, extra)
{
    var channel = message.channel;
    var pos = message.content.split(" ")[1];

    if (pos == undefined)
    {
        channel.send("T'as pas donné de coordonnées \:thinking:");
        return (0);
    }
    if (pos == "new")
    {
        extra.morpion = new Morpion();
        channel.send("Partie de **Morpion** réinitialisée.");
        return (0);
    }
    if (pos == "send")
    {
        let msg = message.content.substring(extra.botInfos.prefix.length + name.length + 6);
        if (msg != undefined)
        {
            extra.botInfos.guilds.forEach(bGuild => {
                if (bGuild.blockedCmds.find(blockedCmd => blockedCmd == "morpion") == undefined)
                    bGuild.sendOnChannel("**`" + message.author.username + "`** sur **" + message.channel.guild.name + "** dit :\n" + "*" + msg + "*", "games");
            });
            message.delete().catch(err => botInfos.log("Erreur lors d'un msg.delete() morpion : " + err));
        }
        else
            message.channel.send("Vous n'avez pas donné de message \:thinking:");
        return (0);
    }
    y = pos.split(",")[0];
    x = pos.split(",")[1];
    if (x == undefined || y == undefined)
    {
        channel.send("Mauvais format de coordonnées \:thinking:\nEx: **" + extra.botInfos.prefix + "morpion y,x**  (y et x compris entre 1 et 3)");
        return (0);
    }
    if (extra.morpion.put_morpion(y, x, channel, extra, message.author) <= 0)
        return (0);
    extra.morpion = new Morpion();
    return (0);
}

var morpion = new Cmd(name, description, func);

module.exports = morpion;