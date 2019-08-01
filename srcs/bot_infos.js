const BotDate = require("./class/bot_date.js");

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
        this.token = "NjAzODg0MjE0NDQxNzM4MjQz.XUK7Hg.voX8PRLcIga8oivcFiq-HhiGlAI";
    }

    log(msg)
    {
        console.log(new BotDate().fromDate(new Date().toString()) + " > " + msg);
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
                }).catch(err => this.log("Erreur lors de l'envoi d'un DM à un administrateur : " + err));
            }
        });
    }
}

module.exports = BotInfos;