const Cmd = require("../class/cmd.js");

var name = "modo";

var description = "Envoie un message (**que vous devez écrire à la suite de la commande**) à tous les modos, __**ne pas abuser**__.";

var func = function (message, extra)
{
    var members = message.guild.members;
    var found = false;

    var user = message.member.user;
    var user_msg = message.content.substring(extra.botInfos.prefix.length + name.length + 1);

    members.forEach(member => {
        if (member.hasPermission("KICK_MEMBERS") && !member.user.bot)
        {
            found = true;
            member.createDM().then(function (channel) {
                let msg = `Bonjour modérateur **${member.user}**.\n`;
                msg += `**${user}** du Refuge à quérit la présence d'une autorité pour la raison suivante :\n\n`;
                msg += "*" + user_msg + "*\n\n- Sady";
                channel.send(msg);
            }).catch(err => extra.botInfos.log("Erreur lors de l'envoie d'un DM à un modérateur : " + err));
        }
    });
    if (found)
        message.channel.send(`**${user}**, les modérateurs ont été prévenus.`);
    else
        message.channel.send("Je n'ai trouvé aucun Modérateur sur ce serveur \:thinking:");
}

var modo = new Cmd(name, description, func);

module.exports = modo;