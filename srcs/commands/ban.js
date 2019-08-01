const Cmd = require("../class/cmd.js");

var name = "ban";

var description = "__**Banni**__ la personne **mentionnée** du serveur, pour la **raison décrite à la suite** si vous en précisée une.\n(__**nécessite d'être au moins administrateur**__)";

var func = function(message, extra)
{
    if (!message.guild.member(extra.bot.user).hasPermission("BAN_MEMBERS"))
    {
        message.channel.send("Vous ne m'avez pas donné la permission de **bannir** des gens \:thinking:");
        return (0);
    }
    
    if (!message.channel.guild.member(message.author).hasPermission("ADMINISTRATOR"))
    {
        message.channel.send("Vous n'avez __**pas la permission**__ de bannir quelqu'un ! \:frowning:");
        if (message.mentions.users.size != 0)
            extra.botInfos.alertAdmins(`${message.author} à essayé de bannir ${message.mentions.users.first()} !`);
        return (0);
    }

    if (message.mentions.users.size == 0)
    {
        message.channel.send("Vous devez me **mentionner** quelqu'un \:thinking:");
        return (0);
    }
    var userBanned = message.mentions.users.first();
    var banMsg = message.content.substring(extra.botInfos.prefix.length + name.length + message.content.split(' ')[1].length + 2);
    if (message.content.split(' ')[2] == undefined)
    {
        message.channel.send(`**${message.author}** à expulsé **${userBanned}** !`);
        message.channel.guild.member(userBanned).kick();
    } 
    else
    {
        message.channel.guild.member(userKicked).createDM().then(function (channel) {
            let msg = `Bonjour **${userBanned}**.\n`;
            msg += "Vous avez été **banni** de **" + extra.botInfos.serverName + "** pour la raison suivante :\n\n";
            msg += "*" + banMsg + "*\n\n- Sady";
            channel.send(msg);
        }).catch(console.error());
        message.channel.send(`**${message.author}** à expulsé **${userBanned}** pour la raison suivante :\n*` + banMsg + "*");
        message.channel.guild.member(userBanned).kick(banMsg);
    }
    message.delete();
    return (0);
}

var ban = new Cmd(name, description, func);

module.exports = ban;