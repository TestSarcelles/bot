const Discord = require('discord.js');
const Extra = require("./srcs/class/extra.js");
const EventCenter = require("./srcs/class/event_center.js");
const BotInfos = require("./srcs/bot_infos.js");
const Morpion = require("./srcs/class/morpion.js");
const Power4 = require("./srcs/class/power4.js");
const GuildCenter = require("./srcs/class/guild_center.js");
const CvCenter = require("./srcs/class/cv_center.js");
const TeamCenter = require("./srcs/class/team_center.js");
const commands = require("./srcs/cmd_center");
var cron = require('node-cron');

var bot = new Discord.Client();
var botInfos = new BotInfos();

var team_center = new TeamCenter();
var event_center = new EventCenter();
var cv_center = new CvCenter();
var guild_center = new GuildCenter();
guild_center.botInfos = botInfos;

var extra = new Extra();
extra.morpion = new Morpion();
extra.power4 = new Power4();
extra.commands = commands;
extra.event_center = event_center;
extra.cv_center = cv_center;
extra.team_center = team_center;
extra.botInfos = botInfos;
extra.bot = bot;
extra.guild_center = guild_center;

var task = cron.schedule('0 * * * *', () => {
    event_center.checkNearEvents(extra);
}, {
    scheduled: false
});

var saveEvents = cron.schedule("*/30 * * * *", () => {
    event_center.saveEvents();
}, {
    scheduled: false
});

bot.on("ready", () => {
    event_center.loadEvents();
    cv_center.loadCvs();
    team_center.loadTeams();
    guild_center.setStartGuilds(bot.guilds);
    bot.user.setActivity(botInfos.activity);
    //let msg = "Je suis opérationnel et **mis à jour**, faites un petit __**" + botInfos.prefix + "help**__ pour voir les **nouveautés** \:sunglasses:\n"
    //guild_center.sendAllGuildsMsg(msg);
    task.start();
    saveEvents.start();
});

bot.on("guildCreate", guild => {
    guild_center.addGuild(guild);
    let msg = "Bonjour tout le monde ! Je m'appelle **OverLead**, pour vous servir \:heart:\n";
    msg += "Faites un petit **" + botInfos.prefix + "help** pour prendre connaissance de ce que **je peux faire** ! \:sunglasses:\n";
    msg += "Pour les administrateurs/modérateurs, faites également un petit **" + botInfos.prefix + "requirements** pour être sûr d'avoir tout ce dont j'ai **besoin** pour fonctionner **au poil** \:wink:\n";
    msg += "ainsi qu'un **" + botInfos.prefix + "help** pour configurer le __**tag**__.";
    guild_center.getGuild(guild, "g").defaultChannel.send(msg).catch(err => botInfos.log("Erreur lors de l'invitation du bot : " + err));
});

function get_command(command)
{
    if (command.startsWith(botInfos.prefix) == false)
        return (-2);
    for (var i = 0; i < commands.length; i++)
    {
        if (command == botInfos.prefix + commands[i].name)
            return (i);
    }
    return (-1);
}

bot.on('message', function (message) {
    if ((message.channel.type == "dm" && !message.content.startsWith(botInfos.prefix + "cv set") && !message.content.startsWith(botInfos.prefix + "team set"))
    || message.author.bot)
    {
        if (message.author.bot)
            return ;
        let msg = "Vous ne pouvez qu'utiliser **" + botInfos.prefix + "cv set** et **" + botInfos.prefix + "team set** en MP.\n"
        msg += "Pour créer votre **Team/CV** ou pour toute **autre commande**, je vous redirige vers un serveur du **réseau OverLead**."
        return (message.reply(msg).catch(err => botInfos.log("Erreur lors du reply en MP : " + err)));
    }
        
    let ref = "ou à faire un __**" + botInfos.prefix + "event new**__ pour créer le votre ! \:smile:";
    let bGuild;
    if (message.channel.type != "dm")
        bGuild = guild_center.getGuild(message, "msg");
    if (message.channel.type != "dm" && message.author.bot == true && message.content.includes(ref))
        bGuild.lastHourMsg = message;
    let command = message.content.split(" ")[0];
    let cmd_id = get_command(command);
    if (cmd_id < 0)
        return ;
    if (message.channel.type != "dm" && bGuild.blockedCmds.find(blockedCmd => botInfos.prefix + blockedCmd == command) != undefined)
    {
        message.channel.send("Désolé mais cette commande est **désactivée** sur ce serveur \:thinking:").catch(err => botInfos.log("Erreur lors d'un send : " + err));
        return ;
    }
    let origin = ((message.channel.type == "dm") ? " en MP" : " sur " + message.member.guild.name);
    botInfos.log(message.author.username + origin + " à utilisé la commande : " + message);
    if (commands[cmd_id].run(message, extra) == 1)
        message.channel.send("*OverLead*, out ! \:sunglasses:").catch(err => botInfos.log("Erreur lors d'un send : " + err));
});

bot.on('guildMemberAdd', function (member) {
    member.createDM().then(function (channel) {
        extra.greetHelp = channel;
        let cmdLength = extra.commands.length;
        for (var i = 0; i < cmdLength; i++)
        {
            if (extra.commands[i].name === "help")
            {
                extra.commands[i].run(member.guild, extra);
                break;
            }
        }
        extra.greetHelp = null;
    }).catch(err => botInfos.log("Erreur lors de la creation du MP greetings : " + err));
    let bGuild = guild_center.getGuild(member, "mem");
    if (bGuild.blockedCmds.find(blockedCmd => blockedCmd == "greetings") == undefined)
    {
        const overWL = bot.emojis.get(extra.emojis["overWL"]);
        let greet = "Bienvenue sur **" + member.guild.name + `**, __**${member}**__ ! \:smiley:\n`;
        if (bGuild.greetings != null)
            greet += bGuild.greetings + "\n";
        greet += "Tu peux utiliser **" + botInfos.prefix + "help** pour consulter toutes les **commandes** du serveur !\n";
        if (bGuild.blockedCmds.find(blockedCmd => blockedCmd == "ranks") == undefined)
        {
            greet += "Si tu le souhaites, tu peux **cliquer sur l'un des rôles ci-dessous** pour te le voir directement attribué !\n";
            greet += `Cela permettra à quiconque de te mentionner s'il recherche quelqu'un de ton rang ${overWL}\n`;
        }
        greet += "**Amuse toi bien !** \:smile:";
        if (bGuild.greetingsChannel != null)
            bGuild.greetingsChannel.send(greet).catch(err => botInfos.log("Erreur lors d'un greet : " + err));
        else
            bGuild.defaultChannel.send(greet).catch(err => botInfos.log("Erreur lors d'un greet : " + err));
    }
});

bot.on('guildMemberRemove', function (member) {
    let bGuild = guild_center.getGuild(member, "mem");
    if (bGuild.blockedCmds.find(blockedCmd => blockedCmd == "leave") == undefined)
    {
        bGuild.defaultChannel.send(`${member.user} nous à **quitté**. R.I.P \:cry:`).catch(err => botInfos.log("Erreur lors d'un leave : " + err));
    }
});


bot.on('message', function (message) {
    //if ((message.member == null || message.member.user.bot) && message.content.includes("**Amuse toi bien !** \:smile:"))
    let bGuild;
    if (message.channel.type == "dm")
        return ;
    bGuild = guild_center.getGuild(message.channel.guild, "g");
    if (message.author == bot.user && message.content.includes("**Amuse toi bien !** \:smile:") && bGuild.blockedCmds.find(blockedCmd => blockedCmd == "ranks") == undefined)
    {
        let cmd_id = get_command(botInfos.prefix + "ranks");
        commands[cmd_id].run(message, extra);
    }
});

bot.on('messageReactionAdd', (reaction, user) => {
    let member;
    let roles;
    let role_id;
    
    let bGuild = guild_center.getGuild(reaction.message.guild.member(user), "mem");
    if (user.bot || (!reaction.message.member.user.bot && reaction.message.content != botInfos.prefix + "ranks")
    || bGuild.blockedCmds.find(blockedCmd => blockedCmd == "ranks") != undefined)
        return ;
    if (!reaction.message.guild.member(bot.user).hasPermission("MANAGE_ROLES"))
        return (message.channel.send("Vous ne m'avez pas donné la permission de **gérer les rôles** \:thinking:").catch(err => botInfos.log("Erreur lors d'un send : " + err)));
    member = reaction.message.channel.guild.member(user);
    roles = reaction.message.channel.guild.roles;
    role_id = null;
    roles.forEach(role => {
        extra.ranks.forEach(rank => {
            if (rank.names.find(name => name == role.name) != undefined)
            {
                role_id = role.id;
                member.removeRole(role_id).catch(err => botInfos.log("Erreur lors de removeRole() : " + err));
            } 
        });
    });
    let theRank = extra.ranks.find(rank => rank.emoji == reaction._emoji.name);
    if (theRank != undefined)
    {
        role_id = roles.find(role => theRank.names.find(name => name == role.name) != undefined);
        if (role_id != undefined)
        {
            role_id = role_id.id;
            member.addRole(role_id).catch(err => botInfos.log("Erreur lors de addRole() : " + err));
        }
    }
});

bot.login(botInfos.token);