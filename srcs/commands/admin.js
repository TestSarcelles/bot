const Cmd = require("../class/cmd.js");

var name = "admin";

var description = "Envoie un message (**que vous devez écrire à la suite de la commande**) à tous les admins, __**cas d'urgence uniquement**__.";

var func = function (message, extra)
{
    var members = message.guild.members;
    var found = false;

    var user = message.member.user;
    var user_msg = message.content.substring(extra.botInfos.prefix.length + name.length + 1);

    members.forEach(member => {
        if (member.hasPermission("ADMINISTRATOR") && !member.user.bot)
        {
            found = true;
            member.createDM().then(function (channel) {
                let msg = `Bonjour administateur **${member.user}**.\n`;
                msg += `**${user}** du Refuge à quérit la présence d'une autorité pour la raison suivante :\n\n`;
                msg += "*" + user_msg + "*\n\n- Sady";
                channel.send(msg);
            }).catch(console.error());
        }
    });
    if (found)
        message.channel.send(` **${user}**, les administateurs ont été prévenus.`);
    else
        message.channel.send("Je n'ai trouvé aucun Administrateur sur ce serveur \:thinking:");
}

var admin = new Cmd(name, description, func);

module.exports = admin;