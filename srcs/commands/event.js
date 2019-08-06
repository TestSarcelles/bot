const BotInfos = require("../bot_infos.js");
const Cmd = require("../class/cmd.js");
const Event = require("../class/event.js");
const BotDate = require("../class/bot_date.js");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const botInfos = new BotInfos();

var delimitor = ";"

var name = "event";

var description = "Permet de **gérer les évènements** de **votre serveur** et d'intéragir avec ceux **des autres serveurs**.\n";
description += "Faites __**" + botInfos.prefix +"event help**__ pour connaitre les **commandes**.";

var func = function (message, extra)
{
    var channel = message.channel;
    var key_word = message.content.split(" ")[1];
    var KW_id = extra.event_center.getKeyWordId(key_word);

    if (KW_id < 0)
    {
        channel.send("Mot clé de la commande **event** invalide \:thinking:\nMots clés **disponibles** :\n" + extra.event_center.getKeyWords());
        return (0);
    }
    if (KW_id == 0)
    {
        var bGuild = extra.botInfos.guilds.find(bGuild => bGuild.id == message.member.guild.id);
        /*var now = null;
        var request = new XMLHttpRequest();
        request.open('GET', 'http://worldtimeapi.org/api/timezone/Europe/Paris', false);
        request.send(null);
        if (request.status === 200)
            now = new BotDate().fromHTTP(request.responseText);*/
        var now = new BotDate().fromDate(new Date().toString());
        if (now == null)
            now = new BotDate().fromDate(new Date().toString());
        var date = new BotDate(message.content.split(" ")[2] + " " + message.content.split(" ")[3]);
        var title = message.content.split(delimitor)[1];
        var description = message.content.split(delimitor)[2];
        if (!date.valid || date.isBefore(now) || title == undefined || description == undefined)
        {
            if (date.isBefore(now))
                channel.send("**Date invalide**, vous devez spécifier un moment **ultérieur à maintenant**.");
            else
                channel.send("Mauvais format.\nEx : **" + extra.botInfos.prefix + "event new J/M/A HhM __" + delimitor + "__ Le titre __" + delimitor + "__ La description** attendu.");
            return (0);
        }
        var event = new Event(title, description, extra.event_center.getNewId(), message.member, date, message.member.guild.id);
        bGuild.defaultChannel.createInvite({maxAge : 60 * 60 * 24, maxUses : 100}).then(invite => {
            event.invite = invite.code;
            extra.event_center.addEvent(event, message, extra);
        }).catch(err => extra.botInfos.log("Erreur lors de la génération de l'invitation dans l'event : " + err));
    }
    if (KW_id == 1)
        extra.event_center.listEvents(message);
    if (KW_id == 2)
    {
        var id = message.content.split(" ")[2];
        if (id == undefined)
        {
            channel.send("Mauvais format.\nEx : **" + extra.botInfos.prefix + "event infos __id__** attendu.");
            return (0);
        }
        extra.event_center.getInfos(id, message, extra);
    }
    if (KW_id == 3)
    {
        var id = message.content.split(" ")[2];
        if (id == undefined)
        {
            channel.send("Mauvais format.\nEx : **" + extra.botInfos.prefix + "event join __id__** attendu.");
            return (0);
        }
        extra.event_center.joinEvent(id, message, null, extra.guild_center.getGuild(message.member.guild, "g").tag);
    }
    if (KW_id == 4)
    {
        var id = message.content.split(" ")[2];
        if (id == undefined)
        {
            channel.send("Mauvais format.\nEx : **" + extra.botInfos.prefix + "event leave __id__** attendu.");
            return (0);
        }
        extra.event_center.leaveEvent(id, message, null, extra.guild_center.getGuild(message.member.guild, "g").tag);
    }
    if (KW_id == 5)
    {
        var id = message.content.split(" ")[2];
        if (id == undefined)
        {
            channel.send("Mauvais format.\nEx : **" + extra.botInfos.prefix + "event delete __id__** attendu.");
            return (0);
        }
        extra.event_center.deleteEvent(id, message, false);
    }
    if (KW_id == 6)
    {
        var id = message.content.split(" ")[2];
        if (!message.channel.guild.member(message.author).hasPermission("KICK_MEMBERS"))
        {
            message.channel.send("Vous n'avez __**pas la permission**__ d'ajouter quelqu'un à un **évènement** ! \:frowning:");
            return (0);
        }
        if (id == undefined || message.mentions.users.size == 0)
        {
            channel.send("Mauvais format.\nEx : **" + extra.botInfos.prefix + "event add __id__ __\@user__** attendu.");
            return (0);
        }
        let user = message.mentions.users.first();
        if (user.bot == true)
            channel.send("Vous ne pouvez pas ajouter un Bot \:frowning:.");
        else
            extra.event_center.joinEvent(id, message, message.mentions.users.first(), extra.guild_center.getGuild(message.member.guild, "g").tag);
    }
    if (KW_id == 7)
    {
        var id = message.content.split(" ")[2];
        if (!message.channel.guild.member(message.author).hasPermission("KICK_MEMBERS"))
        {
            message.channel.send("Vous n'avez __**pas la permission**__ d'enlever quelqu'un d'un **évènement** ! \:frowning:");
            return (0);
        }
        if (id == undefined || message.mentions.users.size == 0)
        {
            channel.send("Mauvais format.\nEx : **" + extra.botInfos.prefix + "event remove __id__ __\@user__** attendu.");
            return (0);
        }
        let user = message.mentions.users.first();
        if (user.bot == true)
            channel.send("Vous ne pouvez pas enlever un Bot \:frowning:.");
        else
            extra.event_center.leaveEvent(id, message, message.mentions.users.first(), extra.guild_center.getGuild(message.member.guild, "g").tag);
    }
    if (KW_id == 8)
    {
        var searchKeyWords = message.content.substring(extra.botInfos.prefix.length + name.length + 6);
        if (searchKeyWords.length == 0)
        {
            message.channel.send("Vous ne m'avez pas précisé de **mots clés** \:thinking:");
            return (0);
        }
        searchKeyWords = searchKeyWords.toLowerCase().split(" ");
        message.channel.send("Voici la **liste des évènements correspondants** à votre recherche :").catch(err => extra.botInfos.log("Erreur lors d'un send event : " + err));
        let nbr_found = 0;
        extra.event_center.events.forEach(event => {
            let found = true;
            for (var skw of searchKeyWords)
            {
                if (!event.title.toLowerCase().includes(skw) && !event.description.toLowerCase().includes(skw))
                {
                    found = false;
                    break ;
                }
            }
            if (found)
            {
                message.channel.send(event.lightPrint()).catch(err => extra.botInfos.log("Erreur lors d'un event find : " + err));
                nbr_found += 1;
            }
        });
        if (nbr_found == 0)
            message.channel.send("Aucun **évènement** ne correspond à votre recherche.").catch(err => extra.botInfos.log("Erreur lors d'un send event : " + err));
    }
    if (KW_id == 9)
        extra.event_center.showHelp(message);
    return (0);
}

var clean = new Cmd(name, description, func);

module.exports = clean;