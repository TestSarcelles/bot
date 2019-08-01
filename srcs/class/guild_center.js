const BotGuild = require("./bot_guild.js");
const LightBotGuild = require("./light_bot_guild.js");
var fs = require('fs');
var path = require("path");

class GuildCenter
{
    constructor(botInfos)
    {
        this.botInfos = botInfos;
        this.jsonGuildsFile = path.join(__dirname, "..", "JSON", "bGuilds.json");
    }

    setNewGuild(guild)
    {
        let newGuild = new BotGuild();
        let defaultChannel = guild.channels.find(channel => channel.name == "général" || channel.name == "general");
        if (defaultChannel == undefined || defaultChannel == null)
        {
            console.log("pas de général, premier channel text sélectionné");
            defaultChannel = guild.channels.find(channel => channel.type == "text");
        }
        newGuild.setName(guild.name);
        newGuild.setId(guild.id);
        newGuild.setDefaultChannel(defaultChannel);
        newGuild.setRoles(guild.roles);
        newGuild.setMembers(guild.members);
        return (newGuild);
    }

    setStartGuilds(guilds)
    {
        guilds.forEach(guild => {
            this.botInfos.guilds.push(this.setNewGuild(guild));
        });
        let jsonGuilds = this.getLightbGuilds();
        if (jsonGuilds == null)
            return ;
        jsonGuilds.forEach(jsonGuild => {
            let bGuild = this.botInfos.guilds.find(guild => guild.id == jsonGuild.id);
            if (bGuild != undefined)
            {
                bGuild.tag = jsonGuild.tag;

                let maybeNewDefaultChannel = guilds.find(guild => guild.id == jsonGuild.id).channels.find(channel => channel.id == jsonGuild.defaultChannelId);
                if (maybeNewDefaultChannel != undefined)
                    bGuild.defaultChannel = maybeNewDefaultChannel;
                if (jsonGuild.eventsChannelId != null)
                    bGuild.eventsChannel = guilds.find(guild => guild.id == jsonGuild.id).channels.find(channel => channel.id == jsonGuild.eventsChannelId);
                if (jsonGuild.eventsChannelId == null || bGuild.eventsChannel == undefined)
                    bGuild.eventsChannel = null;
                
                if (jsonGuild.gamesChannelId != null)
                    bGuild.gamesChannel = guilds.find(guild => guild.id == jsonGuild.id).channels.find(channel => channel.id == jsonGuild.gamesChannelId);
                if (jsonGuild.gamesChannelId == null || bGuild.gamesChannel == undefined)
                    bGuild.gamesChannel = null;
                
                if (jsonGuild.greetingsChannelId != null)
                    bGuild.greetingsChannel = guilds.find(guild => guild.id == jsonGuild.id).channels.find(channel => channel.id == jsonGuild.greetingsChannelId);
                if (jsonGuild.greetingsChannelId == null || bGuild.greetingsChannel == undefined)
                    bGuild.greetingsChannel = null;
                
                bGuild.blockedCmds = jsonGuild.blockedCmds;
            }
        });
    }

    getLightbGuilds()
    {
        let rawData = fs.readFileSync(this.jsonGuildsFile);
        let lightBotGuilds = JSON.parse(rawData);
        return (lightBotGuilds);
    }

    saveGuilds()
    {
        let lightbGuilds = [];

        this.botInfos.guilds.forEach(bGuild => {
            lightbGuilds.push(new LightBotGuild(bGuild));
        });
    
        let data;
        if (lightbGuilds.length > 0)
            data = JSON.stringify(lightbGuilds, null, 2);
        else
            data = null;
        fs.writeFile(this.jsonGuildsFile, data, (err) => {
            if (err) throw err;
            console.log('bGuilds sauvegardées');
        });
    }

    setDefaultsChannel(guild, newChannel, channelCategory)
    {
        let bGuild = this.botInfos.guilds.find(bG => bG.id == guild.id);
        if (channelCategory == "default")
            bGuild.defaultChannel = newChannel; 
        else if (channelCategory == "events")
            bGuild.eventsChannel = newChannel;
        else if (channelCategory == "games")
            bGuild.gamesChannel = newChannel;
        else
            bGuild.greetingsChannel = newChannel;
        this.saveGuilds();
    }

    addGuild(guild)
    {
        this.botInfos.guilds.push(this.setNewGuild(guild));
        this.saveGuilds();
    }

    getGuild(val, source)
    {
        if (source == "msg")
            return (this.botInfos.guilds.find(bGuild => bGuild.id == val.member.guild.id));
        if (source == "mem")
            return (this.botInfos.guilds.find(bGuild => bGuild.id == val.guild.id));
        return (this.botInfos.guilds.find(bGuild => bGuild.id == val.id));
    }

    getDefaultChannel(msg)
    {
        return (this.botInfos.guilds.find(bGuild => bGuild.id == msg.member.guild.id).defaultChannel);
    }

    sendAllGuildsMsg(msg)
    {
        this.botInfos.guilds.forEach(bGuild => {
            if (bGuild.defaultChannel != undefined && bGuild.defaultChannel != null)
                bGuild.defaultChannel.send(msg);
        });
    }
}

module.exports = GuildCenter;