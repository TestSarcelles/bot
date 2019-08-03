const Cmd = require("../class/cmd.js");
const Botinfos = require("../bot_infos.js");

const bInf = new Botinfos();

var name = "setChannel";

var description = "Permet de changer les **channels** que OverLead **utilise par défaut** en spécifiant quel channel vous voulez changer ainsi que le **nom** du **nouveau channel**.\n";
description += "Vous pouvez changer le channel **events** dans lequel OverLead envoie tout ce qui est relatif aux **évènements**.\n";
description += "Vous pouvez changer le channel **games** dans lequel OverLead envoie tout ce qui est relatif aux **jeux** (comme le **morpion** par exemple).\n";
description += "Vous pouvez changer le channel **greetings** dans lequel OverLead **souhaite la bienvenue** aux nouveaux membres.\n";
description += "Vous pouvez changer le channel **default** dans lequel OverLead **envoie tout** ce qui n'a pas de channel attribué.\n";
description += "Ex : **" + bInf.prefix + "setChannel __games__ __mon-channel-de-jeux__**\n";
description += "(__**nécessite d'être au moins modérateur**__)";

var func = function(message, extra)
{
    var channelCategory = message.content.split(" ")[1];
    var newChannelName = message.content.split(" ")[2];
    let guild = message.channel.guild;

    if (!guild.member(message.author).hasPermission("KICK_MEMBERS"))
    {
        message.channel.send("Vous n'avez __**pas la permission**__ de modifier le channel par défaut ! \:frowning:");
        return (0);
    }
    if (channelCategory == undefined || newChannelName == undefined)
    {
        message.channel.send("Mauvais format \:thinking:\nEx : **" + extra.botInfos.prefix + name + " channelCategory __channel-name__**.");
        return (0);
    }
    if (channelCategory != "default" && channelCategory != "games" && channelCategory != "events" && channelCategory != "greetings")
    {
        message.channel.send("Mauvais channelCategory \:thinking:\n**default** ou **events** ou **games** ou **greetings** attendu.");
        return (0);
    }
    var newChannel = message.channel.guild.channels.find(channel => channel.name == newChannelName);
    if (newChannel == undefined || newChannel.type != "text")
    {
        if (newChannel == undefined)
            message.channel.send("Ce channel n'existe pas \:thinking:");
        else
            message.channel.send("Ce channel n'est pas textuel \:thinking:");
        return (0);
    }
    message.channel.send("**" + newChannel.name + "** est maintenant le nouveau channel **" + channelCategory + "** \:sunglasses:");
    extra.guild_center.setDefaultsChannel(guild, newChannel, channelCategory);
    return (0);
}

var setChannel = new Cmd(name, description, func);

module.exports = setChannel;