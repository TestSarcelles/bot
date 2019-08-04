const Discord = require('discord.js');
const Cmd = require("../class/cmd.js");

var name = "help";

var description = "Liste toutes les **commandes** disponibles.";

var func = function(message, extra)
{
    let help = new Discord.RichEmbed()
        .setColor('#fcb268')
        .setTitle(`Voici la liste des commandes disponibles :`)
        .setThumbnail("https://hostpic.xyz/files/15649181173532744656.jpg");
    for (var i = 0; i < extra.commands.length; i++)
    {
        if (extra.commands[i].description != "creator")
            help.addField("\t" + extra.botInfos.prefix + "**" + extra.commands[i].name + "**", extra.commands[i].description, true);
    }
        
    help.setFooter("Créé par IdCom4#8964");
    if (extra.greetHelp != null)
    {
        //here message == guild;
        extra.greetHelp.send("Bienvenue sur **" + message.name + "** ! \:smile:");
        extra.greetHelp.send(help);
    }
    else
    {
        message.reply(" l'aide vous à été envoyée \:sunglasses:");
        message.channel.guild.member(message.author).createDM().then(function (channel) {
            channel.send(help);
        }).catch(err => extra.botInfos.log("Erreur lors de l'envoie du help en DM : " + err));
    }
    return (0);
}

var help = new Cmd(name, description, func);

module.exports = help;