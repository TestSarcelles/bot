const Discord = require('discord.js');
const Cmd = require("../class/cmd.js");

var name = "requirements";

var description = "Liste tous les **prérequis** dont **OverLead** à besoin pour fonctionner correctement.";

var func = function(message, extra)
{
    let requirements = new Discord.RichEmbed()
        .setColor('#fcb268')
        .setTitle(`Voici la liste des prérequis :`)
        .setThumbnail("https://www.topdeguisements.com/530-tm_large_default/costume-d-inf-menestrel.jpg")
        .addField("\t**Faire remonter le rôle de OverLead le Ménestrel tout en haut de la liste:**", "Sinon OverLead ne **pourra pas** gérer les **rôles**.", true)
        .addField("\t**Avoir des Rôles discord correspondant aux rangs Blizzard :**", "(en anglais ou en français, peu importe)\nex : **Grand Maître** ou **Grand Master**", true)
        .addField("\t**Désactiver les messages de bienvenue aléatoires:**", "Ce n'est pas **obligatoire** mais plus **propre**.", true);
    message.channel.send(requirements);
    return (0);
}

var requirements = new Cmd(name, description, func);

module.exports = requirements;