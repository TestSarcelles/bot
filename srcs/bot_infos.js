class BotInfos
{
    constructor()
    {
        this.guilds = [];
        //this.serverName = null;
        this.creator = "IdCom4#8964";
        this.name = "Sady le Ménestrel";
        this.prefix = "$";
        this.activity = "passer le balais ... | " + this.prefix + "help";
        this.token = "NjAzODg0MjE0NDQxNzM4MjQz.XToGow.PjpI2MhWgSPV_T9V90DYANtK_IU";
    }

    

    setServerName(name)
    {
        this.serverName = name;
    }

    setDefaultChannel(channel)
    {
        this.defaultChannel = channel;
    }

    setDefaultMessage(message)
    {
        this.defaultMessage = message;
    }

    alertAdmins(message)
    {
        let members = this.defaultChannel.guild.members;
        members.forEach(member => {
            if (member.hasPermission("ADMINISTRATOR") && !member.user.bot)
            {
                member.createDM().then(function (channel) {
                    let msg = `Bonjour administateur **${member.user}**.\n`;
                    msg += message;
                    msg += "\n\n- Sady";
                    channel.send(msg);
                }).catch(console.error());
            }
        });
    }
}

module.exports = BotInfos;