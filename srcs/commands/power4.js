const BotInfos = require("../bot_infos.js");
const Cmd = require("../class/cmd.js");
const Power4 = require("../class/power4.js");

const bInfs = new BotInfos();

var name = "puissance4";

var description = "Lance une partie de **Puissance 4**, permet de **jouer si une partie est déjà lancée** en entrant la colonne **x**, ou **new** pour redémarrer la partie.\n";
description += "La partie est **commune à tous les serveurs**, si vous voyez quelqu'un lancer une partie, **n'hésitez pas jouer** ! \:smile:";
description += "Vous pouvez également participer à l'échange en commentant la partie en direct en tapant : **" + bInfs.prefix + name + " send __votre message__** !"

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
        extra.power4 = new Power4();
        channel.send("Partie de **Puissance 4** réinitialisée.");
        return (0);
    }
    if (pos == "send")
    {
        let msg = message.content.substring(extra.botInfos.prefix.length + name.length + 6);
        if (msg != undefined)
        {
            extra.botInfos.guilds.forEach(bGuild => {
                if (bGuild.blockedCmds.find(blockedCmd => blockedCmd == "puissance4") == undefined)
                    bGuild.sendOnChannel("**`" + message.author.username + "`** sur **" + message.channel.guild.name + "** dit :\n" + "*" + msg + "*", "games");
            });
            message.delete().catch(err => extra.botInfos.log("Erreur lors d'un msg.delete() p4 : " + err));
        }
        else
            message.channel.send("Vous n'avez pas donné de message \:thinking:");
        return (0);
    }
    if (isNaN(pos))
    {
        channel.send("Mauvais format de coordonnées \:thinking:\nEx: **" + extra.botInfos.prefix + "puissance4 x**  (compris entre 1 et 7)");
        return (0);
    }
    if (extra.power4.put_power(pos, channel, extra, message.author) <= 0)
        return (0);
    extra.power4 = new Power4();
    return (0);
}

var power4 = new Cmd(name, description, func);

module.exports = power4;