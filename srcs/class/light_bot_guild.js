class LightBotGuild
{
    constructor(bGuild)
    {
        this.id = bGuild.id;
        this.tag = bGuild.tag;
        this.defaultChannelId = bGuild.defaultChannel.id;
        this.eventsChannelId = null;
        if (bGuild.eventsChannel != null)
            this.eventsChannelId = bGuild.eventsChannel.id;
        this.gamesChannelId = null;
        if (bGuild.gamesChannel != null)
            this.gamesChannelId = bGuild.gamesChannel.id;
        this.greetingsChannelId = null;
        if (bGuild.greetingsChannel != null)
            this.greetingsChannelId = bGuild.greetingsChannel.id;
        this.blockedCmds = bGuild.blockedCmds;
    }
}

module.exports = LightBotGuild;