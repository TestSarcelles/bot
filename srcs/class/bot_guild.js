const BotInfos = require("../bot_infos.js");

class BotGuild
{
    constructor()
    {
        this.botInfos = new BotInfos();
        this.name = null;
        this.id = null;
        this.defaultChannel = null;
        this.eventsChannel = null;
        this.gamesChannel = null;
        this.greetingsChannel = null;
        this.greetings = null;
        this.tag = true;
        this.roles = null;
        this.members = null;
        this.lastHourMsg = null;
        this.blockedCmds = [];
    }

    setName(name)
    {
        this.name = name;
    }

    setMembers(members)
    {
        this.members = members;
    }

    setId(id)
    {
        this.id = id;
    }

    setDefaultChannel(channel)
    {
        this.defaultChannel = channel;
    }

    setTag(tag)
    {
        this.tag = tag;
    }

    setRoles(roles)
    {
        this.roles = roles;
    }

    sendOnChannel(msg, channelName)
    {
        if (channelName == "events" && this.eventsChannel != null)
            this.eventsChannel.send(msg).catch(err => this.botInfos.log("Erreur lors d'un send sur eventChannel: " + err));
        else if (channelName == "games" && this.gamesChannel != null)
            this.gamesChannel.send(msg).catch(err => this.botInfos.log("Erreur lors d'un send sur gamesChannel : " + err));
        else if (channelName == "greetings" && this.greetingsChannel != null)
            this.greetingsChannel.send(msg).catch(err => this.botInfos.log("Erreur lors d'un send sur greetingsChannel : " + err));
        else
            this.defaultChannel.send(msg).catch(err => this.botInfos.log("Erreur lors d'un send sur defaultChannel : " + err));
    }
}

module.exports = BotGuild;