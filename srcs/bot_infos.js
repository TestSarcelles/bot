const BotDate = require("./class/bot_date.js");

class BotInfos
{
    constructor()
    {
        this.guilds = [];
        //this.serverName = null;
        this.creator = "IdCom4#8964";
        this.name = "OverLead";
        this.prefix = "$";
        this.activity = "Fill pour la team | " + this.prefix + "help";
        this.token = "NjA0MDc3MzMzMjU0NzY2NjMy.XUBscg.hSgw8M7TyTBSC3jUB-4Z-UhRslk";
        this.heros = [
            "ana",
            "ashe",
            "baptiste",
            "brigitte",
            "d.va",
            "doomfist",
            "genji",
            "hanzo",
            "junkrat",
            "lucio",
            "mccree",
            "mei",
            "mercy",
            "moira",
            "orisa",
            "pharah",
            "reaper",
            "reinhardt",
            "roadhog",
            "sigma",
            "soldier",
            "sombra",
            "symmetra",
            "torbjorn",
            "tracer",
            "widowmaker",
            "winston",
            "hammond",
            "zarya",
            "zenyatta"
        ];
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
                    msg += "\n\n- OverLead";
                    channel.send(msg).catch(err => this.log("Erreur lors d'un send : " + err));
                }).catch(err => this.log("Erreur lors de l'envoi d'un DM à un administrateur : " + err));
            }
        });
    }
}

module.exports = BotInfos;