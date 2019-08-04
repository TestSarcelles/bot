const Cmd = require("../class/cmd.js");

var name = "kick";

var description = "__**Expluse**__ la personne **mentionnée** du serveur, pour la **raison décrite à la suite** si vous en précisée une.\n(__**nécessite d'être au moins modérateur**__)";

var func = function(message, extra)
{
    if (!message.guild.member(extra.bot.user).hasPermission("KICK_MEMBERS"))
    {
        message.channel.send("Vous ne m'avez pas donné la permission **d'expulser** des gens \:thinking:");
        return (0);
    }
    
    if (!message.channel.guild.member(message.author).hasPermission("KICK_MEMBERS"))
    {
        message.channel.send("Vous n'avez __**pas la permission**__ d'expulser quelqu'un ! \:frowning:");
        if (message.mentions.users.size != 0)
            extra.botInfos.alertAdmins(`${message.author} à essayé d'expulser ${message.mentions.users.first()} !`);
        return (0);
    }

    if (message.mentions.users.size == 0)
    {
        message.channel.send("Vous devez me **mentionner** quelqu'un \:thinking:");
        return (0);
    }
    var userKicked = message.mentions.users.first();
    var kickMsg = message.content.substring(extra.botInfos.prefix.length + name.length + message.content.split(' ')[1].length + 2);
    if (message.content.split(' ')[2] == undefined)
    {
        message.channel.send(`**${message.author}** à expulsé **${userKicked}** !`);
        message.channel.guild.member(userKicked).kick();
    } 
    else
    {
        message.channel.guild.member(userKicked).createDM().then(function (channel) {
            let msg = `Bonjour **${userKicked}**.\n`;
            msg += "Vous avez été **expulsé** de **" + message.channel.guild.name + "** pour la raison suivante :\n\n";
            msg += "*" + kickMsg + "*\n\n- OverLead";
            channel.send(msg).catch(err => extra.botInfos.log("Erreur lors de l'envoie du DM d'expulsion : " + err));
        }).catch(err => extra.botInfos.log("Erreur lors la creation d'un DM : " + err));
        message.channel.send(`**${message.author}** à expulsé **${userKicked}** pour la raison suivante :\n` + "*" + kickMsg + "*").catch(err => extra.botInfos.log("Erreur lors d'un send kick : " + err));
        message.channel.guild.member(userKicked).kick(kickMsg);
    }
    message.delete().catch(err => extra.botInfos.log("Erreur lors d'un msg.delete() kick : " + err));
    return (0);
}

var kick = new Cmd(name, description, func);

module.exports = kick;