const Cmd = require("../class/cmd.js");
const Botinfos = require("../bot_infos.js");

const bInf = new Botinfos();

var name = "greetings";

var description = "Permet de **personnaliser** le **message de bienvenue** de OverLead en ajoutant ce que vous lui direz **entre la première ligne et le reste**.\n";
description += "Ex : **" + bInf.prefix + "greetings __Nous te souhaitons de passer un agréable moment parmis nous, et n'oublie pas d'aller lire les règles :)__**\n";
description += "Resultat :\n";
description += "Bienvenue sur **Nom du Serveur**, __**John Doe**__ ! \:smiley:\n";
description += "Nous te souhaitons de passer un agréable moment parmis nous, et **n'oublie pas** d'aller lire les règles :)\n"
description += "Tu peux utiliser **" + bInf.prefix + "help** pour consulter toutes les **commandes** du serveur !\n";
description += "*etc ... suite du message de bienvenue habituel*\n";
description += "Faites **" + bInf.prefix + "greetings** sans rien préciser pour **enlever** votre personnalisation.\n";
description += "(__**nécessite d'être au moins modérateur**__)";

var func = function(message, extra)
{
    var newGreetMsg = message.content.substring(extra.botInfos.prefix.length + name.length + 1);
    let guild = message.channel.guild;

    if (!guild.member(message.author).hasPermission("KICK_MEMBERS"))
    {
        message.channel.send("Vous n'avez __**pas la permission**__ de modifier le message de bienvenue ! \:frowning:");
        return (0);
    }
    if (newGreetMsg == undefined)
        newGreetMsg = null;
    message.channel.send("**Message de bienvenue** correctement mis à jour \:sunglasses:");
    extra.guild_center.setGreetings(guild, newGreetMsg);
    return (0);
}

var greetings = new Cmd(name, description, func);

module.exports = greetings;