const Discord = require("discord.js");
const Cmd = require("../class/cmd.js");
const BotInfos = require("../bot_infos.js");

var botInfos = new BotInfos();

var name = "cmd";

var description = "Permet **d'activer ou désactiver** un commande, faites un **" + botInfos.prefix + "cmd help** pour avoir le details des commandes désactivables,\n";
description += "ou **" + botInfos.prefix + "cmd list** pour voir toutes les commandes que vous avez **désactivé**.\n"
description += "Ex: **" + botInfos.prefix + "cmd __ranks__ off** va désactiver la commande **ranks**.\n(__**nécessite d'être au moins modérateur**__)";

var func = function (message, extra)
{
    var theCmd = message.content.split(" ")[1];
    var toggle = message.content.split(" ")[2];
    var approve = false;

    if (!message.channel.guild.member(message.author).hasPermission("KICK_MEMBERS"))
    {
        message.channel.send("Vous n'avez __**pas la permission**__ d'utiliser la commande **cmd** ! \:frowning:");
        return (0);
    }
    if (theCmd == "help")
    {
        let help = new Discord.RichEmbed()
            .setColor('#fcb268')
            .setTitle(`Voici la liste des **commandes désactivables** :`)
            .setThumbnail("https://www.topdeguisements.com/530-tm_large_default/costume-d-inf-menestrel.jpg")
            .addField("Toutes les commandes listées dans le **" + extra.botInfos.prefix + "help**", "Exceptées évidemment de **help** et **cmd**.", true)
            .addField("**checkEvents** :", "Si vous désactivez **checkEvents**, vous ne recevrez plus les **alertes** concernant les évènements **sur le point d'avoir lieux**.", true)
            .addField("**events** :", "Si vous désactivez **events**, en plus de ne plus pouvoir **utiliser la commande** vous ne recevrez plus les **nouveaux évènements d'autres serveurs**.", true)
            .addField("**puissance4** et **morpion** :", "Si vous désactivez ces commandes, vous ne pourrez plus **y jouer** avec les autres serveurs et **ne recevrez plus** les parties.", true)
            .addField("**ranks** :", "Si vous désactivez **ranks**, en plus de ne plus pouvoir **mettre à jour votre rang** quand vous le souhaitez, Sady souhaitera **la bienvenue aux nouveaux membres de manière neutre**, sans mention des rangs Blizzard.", true)
            .addField("**greetings** :", "Si vous désactivez **greetings**, Sady ne **souhaitera plus la bienvenue** aux nouveaux membres.", true)
            .setFooter("Créé par IdCom4#8964");
        message.reply(" l'aide vous à été envoyée \:sunglasses:");
        message.channel.guild.member(message.author).createDM().then(function (channel) {
            channel.send(help);
        }).catch(err => extra.botInfos.log("Erreur lors du DM du cmd help : " + err));
        return (0);
    }

    if (theCmd == "list")
    {
        let bGuild = extra.guild_center.getGuild(message, "msg");
        let help = new Discord.RichEmbed()
            .setColor('#fcb268')
            .setTitle(`Voici la liste des commandes **que vous avez désactivé** :`)
            .setThumbnail("https://www.topdeguisements.com/530-tm_large_default/costume-d-inf-menestrel.jpg");
        let bCmds = "";
        bGuild.blockedCmds.forEach(blockedCmd => {
            bCmds += "- **" + blockedCmd + "**\n";
        });
        if (bCmds == "")
            help.addField("°", "Vous n'avez encore **désactivé aucune** commande.", true);
        else
            help.addField("°", bCmds, true);
        help.setFooter("Créé par IdCom4#8964");
        message.channel.send(help);
        return (0)
    }

    if (theCmd == undefined || toggle == undefined)
    {
        message.channel.send("Mauvais format \:thinking:\nEx : **" + extra.botInfos.prefix + name + " commande __état__** (état = **on** ou **off**)");
        return (0);
    }
    extra.commands.forEach(command => {
        if (command.name == theCmd && command.name != "cmd")
            approve = true;
    });
    if (theCmd == "checkEvents" || theCmd == "greetings")
        approve = true;
    if (approve == false || (toggle != "on" && toggle != "off"))
    {
        if (approve == false && theCmd == "cmd")
            message.channel.send("La commande **cmd** n'est pas soumise à elle même \:thinking:");
        else if (approve == false)
            message.channel.send("Cette commande n'existe pas \:thinking:");
        else
            message.channel.send("Mauvais état, **on** ou **off** attendu \:thinking:");
        return (0);
    }
    let bGuild = extra.guild_center.getGuild(message, "msg");
    if (toggle == "off")
    {
        if (bGuild.blockedCmds.find(blockedCmd => blockedCmd == theCmd) == undefined)
            bGuild.blockedCmds.push(theCmd);
        message.channel.send("La commande **" + theCmd + "** à bien été **désactivée** \:sunglasses:");
    }
    else
    {
        var nbrBlockedCmds = bGuild.blockedCmds.length;
        for (var i = 0; i < nbrBlockedCmds; i++)
        {
            if (bGuild.blockedCmds[i] == theCmd)
            {
                bGuild.blockedCmds.splice(i, 1);
                break;
            }
        }
        message.channel.send("La commande **" + theCmd + "** à bien été **activée** \:sunglasses:");
    }
    extra.guild_center.saveGuilds();
    return (0);
}

var cmd = new Cmd(name, description, func);

module.exports = cmd;