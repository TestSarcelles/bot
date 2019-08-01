const Discord = require('discord.js');
const BotInfos = require('../bot_infos.js');
const LightUser = require('./light_user.js');

class Event
{
    constructor(title, description, id, author, date, guildId)
    {
        this.title = title;
        this.description = description;
        this.id = id;
        this.author = new LightUser(author.id, guildId);
        this.subscribedUsers = [];
        this.subscribedUsers.push(new LightUser(author.id, guildId));
        this.date = date;
        this.guildId = guildId;
        this.invite = null;
    }

    join(user, guildId)
    {
        this.subscribedUsers.push(new LightUser(user.id, guildId));
    }

    leave(user)
    {
        let nbrUsers = this.subscribedUsers.length;
        for (var i = 0; i < nbrUsers; i++)
        {
            if (this.subscribedUsers[i].id == user.id)
            {
                this.subscribedUsers.splice(i, 1);
                return ;
            }
        }
    }

    fullPrint(intro, tag, extra, fromOrigin)
    {
        let bGuild = extra.botInfos.guilds.find(bGuild => bGuild.id == this.guildId);
        let engagedUsersTitle;
        let engagedUsers = "";
        let nbrUsers = this.subscribedUsers.length;
        if (nbrUsers == 0)
        {
            engagedUsersTitle = "Il n'y a encore aucun participant.";
            engagedUsers = "/";
        }
        else
        {
            engagedUsersTitle = "Il y a pour l'instant **" + nbrUsers + "** participant" + ((nbrUsers > 1) ? "s :" : " :") + "\n";
            this.subscribedUsers.forEach(lightUser => {
                let lUbGuild = extra.botInfos.guilds.find(bGuild => bGuild.id == lightUser.guildId);
                let member;
                if (lUbGuild == undefined)
                {
                    if (tag)
                        member = {user: "John Doe"};
                    else
                        member = {user: {username: "John Doe"}};
                }
                else
                    member = lUbGuild.members.find(member => member.user.id == lightUser.id);
                engagedUsers += "- **" + ((tag) ? `${member.user}` : member.user.username) + "**\n";
            });
        }
        let msg = new Discord.RichEmbed()
            .setColor("#fcb268")
            .setTitle(((intro == null) ? "**Evènement**" : intro))
            .addField("__**" + this.title + ":**__\t\t*" + this.date.toString() + "*", "°\n**" + this.description + "**", true)
            .addBlankField()
            .addField(engagedUsersTitle, engagedUsers, true);
        if (fromOrigin == false)
            msg.addField("Lien vers **" + bGuild.name + "** :", "https://discord.gg/" + this.invite, true);
        msg.setFooter("ID: " + this.id);
        return (msg);
    }

    lightPrint()
    {
        let msg = new Discord.RichEmbed()
            .setColor("#fcb268")
            .setTitle("__**" + this.title + "**__\t\t*" + this.date.toString() + "*")
            .setFooter("ID: " + this.id);
        return (msg);
    }

    warn(extra)
    {
        let title = this.title;
        let hour = this.date.getHour();
        let id = this.id;
        this.subscribedUsers.forEach(lightUser =>
        {
            let bGuild = extra.botInfos.guilds.find(bGuild => bGuild.id == lightUser.guildId);
            let member;
            if (bGuild != undefined && (member = bGuild.members.find(member => member.user.id == lightUser.id)) != undefined)
            {
                member.createDM().then(function (channel) {
                    let msg = `Bonjour **${member.user}** ! \:smiley:\n`;
                    msg += "N'oublie pas que tu es inscrit à l'évènement __**" + title + "**__ ayant lieu à **" + hour + "** !\n\n";
                    msg += "*Si tu ne souhaites plus y participer, n'oublie pas de te désister dès maintenant en faisant __**" + extra.botInfos.prefix + "event leave " + id + "**__ !*\n\n";
                    msg += "- Sady";
                    channel.send(msg);
                }).catch(err => extra.botInfos.log("Erreur lors de l'envoie de l'alerte near event en DM : " + err));
            }
        });
    }
}

module.exports = Event;