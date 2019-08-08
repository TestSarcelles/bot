const Discord = require("discord.js");
const BotInfos = require("../bot_infos.js");
const BotDate = require("./bot_date.js");
const Event = require("./event.js");
var fs = require('fs');
var path = require("path");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

class EventCenter
{
    constructor()
    {
        this.bInf = new BotInfos();
        this.delimitor = ';';
        this.events = [];
        this.nextId = 0;
        this.keyWords = ["new", "list", "infos", "join", "leave", "delete", "add", "remove", "find", "help"];
        this.keyWordsDescription = [
            "Permet de créer **un évènement** en indiquant **new**, puis la __**date**__ et __**l'heure**__, ainsi que le __**titre**__ et la __**description**__, séparés par des __**" + this.delimitor + "**__.\nEx : **" + this.bInf.prefix + "event new __01/01/2019__ __21h__ " + this.delimitor + " __mon titre__ " + this.delimitor + " __ma description__**",
            "Permet de consulter la **liste des évènements en cours** en tapant **" + this.bInf.prefix + " event list**.",
            "Permet d'accéder aux **informations détaillées** d'un évènement en tapant **" + this.bInf.prefix + "event infos __ID__** (**ID** = id de l'évènement).",
            "Permet de **vous inscrire** à un évènement en tapant **" + this.bInf.prefix + "event join __ID__** (**ID** = id de l'évènement).",
            "Permet de **quitter** un évènement en tapant **" + this.bInf.prefix + "event leave __ID__** (**ID** = id de l'évènement).",
            "Permet de **supprimer** un évènement en tapant **" + this.bInf.prefix + "event delete __ID__** (**ID** = id de l'évènement), __**si vous êtes son créateur ou au moins modérateur**__.",
            "Permet **d'ajouter manuellement** un joueur en tapant **" + this.bInf.prefix + "event add __ID__ __\@user__** (**ID** = id de l'évènement)\n(__**nécessite d'être au moins modérateur**__)",
            "Permet **d'enlever manuellement** un joueur en tapant **" + this.bInf.prefix + "event remove __ID__ __\@user__** (**ID** = id de l'évènement).\n(__**nécessite d'être au moins modérateur**__)",
            "Permet **de rechercher un évènement** par mot clé en tapant **" + this.bInf.prefix + "event find __les mots clés__**."
        ];
        this.desc = "Les évènements sont en **commun avec tous les serveurs**, alors **n'hésitez pas** à vous inscrire et aller **rencontrer du monde** ! \:smile:";
        this.jsonEventsFile = path.join(__dirname, "..", "JSON", "events.json");
    }

    showHelp(message)
    {
        let i;
        let help = new Discord.RichEmbed()
            .setColor('#fcb268')
            .setTitle(`Voici la liste des **options disponibles** pour la commande __**event**__ :`)
            .setThumbnail("https://hostpic.xyz/files/15649181173532744656.jpg");
        for (i = 0; i < this.keyWords.length - 1; i++)
            help.addField("\t- **" + this.keyWords[i] + "**", this.keyWordsDescription[i], true);
        help.addBlankField()
            .addField(this.desc, "°", true)
            .setFooter("Créé par IdCom4#8964");
        message.reply(" l'aide vous à été envoyée \:sunglasses:");
        message.channel.guild.member(message.author).createDM().then(function (channel) {
            channel.send(help).catch(err => this.bInf.log("Erreur lors du sendHelp event_center : " + err));
        }).catch(err => this.bInf.log("Erreur lors de l'envoie de event help en DM : " + err));
    }

    getKeyWords()
    {
        let list = "";
        this.keyWords.forEach(kw =>{
            list += "- **" + kw + "**\n";
        });
        return (list);
    }

    getKeyWordId(key_word)
    {
        for (var i = 0; i < this.keyWords.length; i++)
        {
            if (this.keyWords[i] == key_word)
                return (i);
        }
        return (-1);
    }

    getNewId()
    {
        return (this.nextId);
    }

    addEvent(event, message, extra)
    {
        this.events.push(event);
        this.nextId += 1;
        extra.botInfos.guilds.forEach(bGuild => {
            if (bGuild.blockedCmds.find(blockedCmd => blockedCmd == "events") == undefined)
            {
                let fromOrigin = ((bGuild.id == event.guildId) ? true : false)
                let tag = bGuild.tag;
                let everyone = bGuild.roles.find(role => role.name === "@everyone");
                let channel = ((bGuild.id == message.member.guild.id) ? message.channel : ((bGuild.eventsChannel != null) ? bGuild.eventsChannel : bGuild.defaultChannel));
                if (channel != undefined && channel != null)
                {
                    if (tag)
                        channel.send(`${everyone}`).catch(err => this.bInf.log("Erreur lors d'un send everyone : " + err));
                    let intro = "Nouvel **évènement** ! faites un **" + extra.botInfos.prefix + "event join " + event.id + "** pour vous y inscrire \:smile:";
                    channel.send(event.fullPrint(intro, tag, extra, fromOrigin)).catch(err => this.bInf.log("Erreur lors d'un send addEvent : " + err));
                }
            }
        });
        message.delete().catch(err => this.bInf.log("Erreur lors d'un msg.delete() event_center : " + err));
        this.saveEvents();
    }

    listEvents(message)
    {
        if (this.events.length == 0)
            return (message.channel.send("Aucun **évènement** de prévu !").catch(err => this.bInf.log("Erreur lors d'un send list event_center : " + err)));
        this.events.forEach(event => {
            message.channel.send(event.lightPrint()).catch(err => this.bInf.log("Erreur lors d'un send list event_center : " + err));
        });
    }

    getInfos(id, message, extra)
    {
        let bGuild = extra.botInfos.guilds.find(bGuild => bGuild.id == message.channel.guild.id)
        let tag = bGuild.tag;
        for (var event of this.events)
        {
            if (event.id == id)
            {
                let fromOrigin = ((event.guildId == bGuild.id) ? true : false);
                message.channel.send(event.fullPrint(null, tag, extra, fromOrigin)).catch(err => this.bInf.log("Erreur lors d'un send getInfos event_center : " + err));
                return ;
            }
        }
        message.channel.send("Aucun évènement ne correspond à cet **ID** \:thinking:").catch(err => this.bInf.log("Erreur lors d'un send no Id event_center: " + err));
    }

    joinEvent(id, message, userAdd, tag)
    {
        for (var event of this.events)
        {
            if (event.id == id)
            {
                let user = ((userAdd == null) ? message.author : userAdd);
                event.join(user, message.channel.guild.id);
                message.channel.send(((userAdd == null) ? "Vous avez" : ((tag) ? `**${userAdd}** à` : "**" + userAdd.username + "** à")) + " bien été **inscrit** à l'évènement ! \:smile:").catch(err => this.bInf.log("Erreur lors d'un send join event : " + err));
                return ;
            }
        }
        message.channel.send("Aucun évènement ne correspond à cet **ID** \:thinking:").catch(err => this.bInf.log("Erreur lors d'un send no Id event_center : " + err));
    }

    leaveEvent(id, message, userLeave, tag)
    {
        for (var event of this.events)
        {
            if (event.id == id)
            {
                let user = ((userLeave == null) ? message.author : userLeave);
                event.leave(user);
                message.channel.send(((userLeave == null) ? "Vous avez" : ((tag) ? `**${userLeave}** à` : "**" + userLeave.username + "** à")) + " bien été **désinscrit** à l'évènement ! \:smile:").catch(err => this.bInf.log("Erreur lors d'un send leaveEvent : " + err));
                return ;
            }
        }
        message.channel.send("Aucun évènement ne correspond à cet **ID** \:thinking:").catch(err => this.bInf.log("Erreur lors d'un send no Id event_center : " + err));
    }

    deleteEvent(id, message, auto)
    {
        let guild;
        if (message != null)
            guild = message.member.guild;
        let nbrEvents = this.events.length;
        let found = false;
        for (var i = 0; i < nbrEvents; i++)
        {
            if (this.events[i].id == id)
            {
                if (auto == true
                || (message.author.username == "IdCom4" && message.author.discriminator == "8964")
                || message.author.id == this.events[i].author.id
                || (message.member.hasPermission("KICK_MEMBERS") && guild.id == this.events[i].guildId))
                {
                    this.events.splice(i, 1);
                    if (!auto)
                        message.channel.send("L'évènement à bien été **supprimé** ! \:smile:").catch(err => this.bInf.log("Erreur lors d'un send deleted event : " + err));
                    this.saveEvents();
                }
                else
                    message.channel.send("Vous n'avez pas la **permission** de supprimer cet évènement \:thinking:").catch(err => this.bInf.log("Erreur lors d'un send no delete permission event_center : " + err));
                found = true;
                return ;
            }
        }
        if (!found)
            message.channel.send("Aucun évènement ne correspond à cet **ID** \:thinking:").catch(err => this.bInf.log("Erreur lors d'un send no Id event_center: " + err));
    }

    checkNearEvents(extra)
    {
        var found = false;
        let nbrEvent = 0;
        /*var now = null;
        var request = new XMLHttpRequest();
        request.open('GET', 'http://worldtimeapi.org/api/timezone/Europe/Paris', false);
        request.send(null);
        if (request.status === 200)
            now = new BotDate().fromHTTP(request.responseText);*/
        var now = new BotDate().fromDate(new Date().toString());
        
        this.events.forEach(event => {
            let eventGuild = extra.botInfos.guilds.find(bGuild => bGuild.id == event.guildId);
            if (now == null)
                now = new BotDate().fromDate(new Date().toString());
            var diff = now.diff(event.date);
            if (diff >= 0 && diff <= 90)
            {
                nbrEvent++;
                event.warn(extra)
                extra.botInfos.guilds.forEach(bGuild => {
                    var everyone = bGuild.roles.find(role => role.name === "@everyone");
                    //check for checkEvents && events at the same time
                    if (bGuild.blockedCmds.find(blockedCmd => blockedCmd.includes("vent") == true) == undefined)
                    {
                        let fromOrigin = ((eventGuild.id == bGuild.id) ? true : false);
                        
                        if (bGuild.tag && nbrEvent == 1 && everyone != undefined)
                            bGuild.sendOnChannel(`${everyone}`, "events");
                        let intro = "Cet **évènement** à lieu " + ((diff == 0) ? "**maintenant**" : "dans **" + diff + "** minutes") + " ! Regardez s'il vous intéresse \:smile:";
                        bGuild.sendOnChannel(event.fullPrint(intro, bGuild.tag, extra, fromOrigin), "events");
                    }
                    found = true;
                });
            }
            else if (diff < 0)
                this.deleteEvent(event.id, null, true);
        });
        if (!found)
        {
            extra.botInfos.guilds.forEach(bGuild => {
                //check for checkEvents && events at the same time
                if (bGuild.blockedCmds.find(blockedCmd => blockedCmd.includes("vent") == true) == undefined)
                {
                    if (bGuild.lastHourMsg != null)
                        bGuild.lastHourMsg.delete().catch(err => extra.botInfos.log("Erreur lors de la suppression du dernier Message de Check : " + err));
                    let msg = "**Coucou tout le monde !** \:smiley:\n";
                    msg += "N'hésitez **pas** à faire un petit __**" + extra.botInfos.prefix + "event list**__ pour voir la liste des **évènements actuels**,\n";
                    msg += "__**" + extra.botInfos.prefix + "event find**__ pour faire une **recherche** personnalisée,\n";
                    msg += "ou à faire un __**" + extra.botInfos.prefix + "event new**__ pour créer le votre ! \:smile:";
                    bGuild.sendOnChannel(msg, "events");
                }
            });
        }
    }

    loadEvents()
    {
        let rawData = fs.readFileSync(this.jsonEventsFile);
        let jsonEvents = JSON.parse(rawData);

        if (jsonEvents == null)
            return ;
        let i = 0;
        jsonEvents.forEach(jsonEvent => {
            let d = jsonEvent.date;
            let bDate = new BotDate(d.day + "/" + d.month + "/" + d.year + " " + d.hour + "h" + d.minute);
            let event = new Event(jsonEvent.title,
                                jsonEvent.description,
                                i,
                                jsonEvent.author,
                                bDate, jsonEvent.guildId);
            event.subscribedUsers = jsonEvent.subscribedUsers;
            event.invite = jsonEvent.invite;
            this.events.push(event);
            i++;
        });
        this.nextId = i;
    }
    
    saveEvents()
    {
        this.bInf.log("Sauvegarde des Events en cours ...");
        if (this.events.length == 0)
            fs.writeFile(this.jsonEventsFile, null, (err) => {if (err) throw err; this.bInf.log('jsonEvents set à null');});
        else
        {
            let data = JSON.stringify(this.events, null, 2);
            fs.writeFile(this.jsonEventsFile, data, (err) => {if (err) throw err; this.bInf.log('Events sauvegardés');});
        }
    }
}

module.exports = EventCenter;