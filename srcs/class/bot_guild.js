const BotDate = require("./bot_date.js");

class BotGuild
{
    constructor()
    {
        this.name = null;
        this.id = null;
        this.defaultChannel = null;
        this.eventsChannel = null;
        this.gamesChannel = null;
        this.greetingsChannel = null;
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
            this.eventsChannel.send(msg);
        else if (channelName == "games" && this.gamesChannel != null)
            this.gamesChannel.send(msg);
        else if (channelName == "greetings" && this.greetingsChannel != null)
            this.greetingsChannel.send(msg);
        else
            this.defaultChannel.send(msg);
    }
}

module.exports = BotGuild;