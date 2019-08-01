const Cmd = require("../class/cmd.js");

var name = "tag";

var description = "Permet **d'activer ou désactiver** le fait de **mentionner** les membres lors des **commandes**, selon que vous ayez précisé __**on**__ ou __**off**__.\n";
description += "Si **rien n'est précisé**, cela passera simplement **de l'etat actuel à l'autre**.\n(__**nécessite d'être au moins modérateur**__)";

var func = function (message, extra)
{
    let guild = message.channel.guild;
    let tag = extra.botInfos.guilds.find(bGuild => bGuild.id == guild.id).tag;

    if (!guild.member(message.author).hasPermission("KICK_MEMBERS"))
    {
        message.channel.send("Vous n'avez __**pas la permission**__ de modifier le Mentionnage ! \:frowning:");
        return (0);
    }
    
    let state = message.content.substring(extra.botInfos.prefix.length + name.length + 1);
    if (message.content.split(' ')[1] == undefined)
        extra.botInfos.guilds.find(bGuild => bGuild.id == guild.id).tag = ((tag) ? false : true);
    else if (state == "on" || state == "off")
        extra.botInfos.guilds.find(bGuild => bGuild.id == guild.id).tag = ((state == "on") ? true : false);
    else
    {
        message.channel.send("Mauvais arguments, **on** ou **off** attendu \:thinking:");
        return (0);
    }
    extra.guild_center.saveGuilds();
    message.channel.send("Tag **" + ((extra.botInfos.guilds.find(bGuild => bGuild.id == guild.id).tag) ? "activé" : "désactivé") + "** ! \:sunglasses:");
    return (0);
}

var tag = new Cmd(name, description, func);

module.exports = tag;