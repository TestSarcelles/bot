const Discord = require('discord.js');
const Cmd = require("../class/cmd.js");

var name = "requirements";

var description = "Liste tous les **prérequis** dont **OverLead** à besoin pour fonctionner correctement.";

var func = function(message, extra)
{
    let requirements = new Discord.RichEmbed()
        .setColor('#fcb268')
        .setTitle(`Voici la liste des prérequis :`)
        .setThumbnail("https://hostpic.xyz/files/15649181173532744656.jpg")
        .addField("\t**Faire remonter le rôle OverLead tout en haut de la liste des rôles:**", "Sinon OverLead ne **pourra pas** utiliser toutes ses **fonctionnalités**.", true)
        .addField("\t**Avoir des Rôles discord correspondant aux rangs Blizzard : **(si la commande **ranks** est activée)", "(en anglais ou en français, peu importe)\nex : **Grand Maître** ou **Grand Master**", true)
        .addField("\t**Désactiver les messages de bienvenue aléatoires:** (si la commande **greetings** est activée)", "Ce n'est pas **obligatoire** mais plus **propre**.", true);
    message.channel.send(requirements).catch(err => extra.botInfos.log("Erreur lors de l'envoie des requirements : " + err));
    return (0);
}

var requirements = new Cmd(name, description, func);

module.exports = requirements;