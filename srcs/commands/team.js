const BotInfos = require("../bot_infos.js");
const Team = require("../class/team.js");
const Cmd = require("../class/cmd.js");

const botInfos = new BotInfos();

var delimitor = ";"

var name = "team";

var description = "Permet de **gérer votre Team** ainsi que rechercher celles des autres.\n";
description += "Faites __**" + botInfos.prefix +"team help**__ pour connaitre les **commandes**.";

var func = function (message, extra)
{
    var key_word = message.content.split(" ")[1];
    var KW_id = extra.team_center.getKeyWordId(key_word);

    if (KW_id < 0)
    {
        message.reply(" mot clé de la commande **team** invalide \:thinking:\nMots clés **disponibles** :\n" + extra.team_center.getKeyWords());
        return (0);
    }
    if (KW_id == 0)
    {
        message.reply(extra.team_center.sendHelp(message.member));
        return (0);
    }
    if (KW_id == 1)
    {
        //var bGuild = extra.botInfos.guilds.find(bGuild => bGuild.id == message.member.guild.id);
        if (extra.team_center.getTeam(message.author) != undefined)
        {
            message.reply(" vous possedez déjà une **Team** \:thinking:");
            return (0);
        }
        var teamName = message.content.substring(botInfos.prefix.length + name.length + 8);
        if (teamName.length == 0)
        {
            message.reply(" vous ne m'avez pas indiqué le nom de votre **Team** \:thinking:");
            return (0);
        }
        var newTeam = new Team(message.author, message.channel.guild.id, extra.team_center.getNewId());
        newTeam.setField("name", teamName);
        message.reply(extra.team_center.addTeam(newTeam));
        return (0);
    }
    if (KW_id == 2)
    {
        var field = message.content.split(" ")[2];
        if (field == undefined || extra.team_center.checkField(field) == -1)
        {
            message.reply(" mauvais field, voici la liste des **fields** disponibles :\n" + extra.team_center.getFields());
            return (0);
        }
        var value = message.content.substring(botInfos.prefix.length + name.length + 5 + field.length + 1);
        //var value = message.content.substring(botInfos.prefix.length);
        if (value.length == 0)
        {
            message.reply(" mauvais format.\nEx : **" + botInfos.prefix + "team set field __value__** attendu.");
            return (0);
        }
        var team = extra.team_center.getTeam(message.author);
        if (team == undefined)
            message.reply(" vous n'avez actuellement **pas de Team** \:thinking:");
        else
        {
            message.reply(team.setField(field, value));
            extra.team_center.saveTeams();
            if (team.infos["rank"] != null && team.infos["wantedPlayers"].length != 0)
            {
                let warnedUsers = [];
                for (var wantedPlayer of team.infos["wantedPlayers"])
                {
                    let matchingCvs = extra.cv_center.findCvs([{field: "peak", value: team.infos["rank"]}, {field: "role", value: wantedPlayer.role}]);
                    matchingCvs.forEach(cv => {
                        if (warnedUsers.find(id => id == cv.author.id) == undefined)
                        {
                            let guild = extra.bot.guilds.find(guild => guild.id == cv.author.guildId);
                            let member;
                            if (guild != undefined && (member = guild.members.find(mem => mem.user.id == cv.author.id)) != undefined)
                            {
                                member.createDM().then(function(channel) {
                                    let finalMsg = `Bonjour **${member.user}**,\n**${message.author}** du serveur **` + message.guild.name;
                                    finalMsg += "** à mis à jour les **profils recherchés** de sa team, cela pourrait peut etre vous **correspondre**";
                                    finalMsg += " (*mettez votre **CV** en indisponible pour ne plus recevoir les **alertes***):\n";
                                    channel.send(finalMsg);
                                    channel.send(team.print(extra.bot.guilds, true));
                                }).catch(err => botInfos.log("Erreur lors de l'envoie d'une alerte team : " + err));
                            }
                        }
                        else
                            warnedUsers.push(cv.author.id);
                    })
                }
                
            }
        }
        return (0);
    }
    if (KW_id == 3)
    {
        var id = message.content.split(" ")[2];
        if (id == undefined)
        {
            message.reply(" mauvais format.\nEx : **" + botInfos.prefix + "team delete __id__** attendu.");
            return (0);
        }
        message.reply(extra.team_center.deleteTeam(message, id));
        return (0);
    }
    if (KW_id == 4)
    {
        let search = message.content.substring(botInfos.prefix.length + name.length + 6);
        if (search.length == 0)
        {
            message.reply(" mauvais format.\nEx : **" + botInfos.prefix + "team find __field__:__value__ ; ect ...** attendu (au moins une paire **field:value**, séparées par des **;** s'il y en a plusieurs).");
            return (0);
        }
        search = search.split(delimitor);
        let criterias = [];
        for (var pair of search)
        {
            let goodFormat = true;
            let _field = pair.split(":")[0];
            let _value = pair.split(":")[1];
            if (_field == undefined || _field.length == 0 || _value == undefined || _value.length == 0)
                goodFormat = false;
            if (goodFormat)
            {
                _field = _field.toLowerCase().trim();
                _value = _value.toLowerCase().trim();
                let expr = _field + ":" + _value;
                if (!expr.match(/((name|rank|description|objectifs|new|role|heros):(\w.*))/))
                {
                    message.reply(" mauvais fields.\nVoici les **fields** de recherche disponibles :\n- **name**\n- **rank**\n- **description**\n- **objectifs**\n- **new**\n- **role**\n- **heros**");
                    return (0);
                }
            }
            if (!goodFormat)
            {
                message.reply(" mauvais format.\nEx : **" + botInfos.prefix + "team find __field__:__value__ ; ect ...** attendu (au moins une paire **field:value**).");
                return (0);
            }
            criterias.push({field: _field, value: _value});
        }
        extra.team_center.printSearch(message, extra, criterias)
    }
    if (KW_id == 5)
        extra.team_center.listTeams(message, extra)
    if (KW_id == 6)
    {
        var id = message.content.split(" ")[2];
        message.delete();
        if (id == undefined)
        {
            message.reply(" mauvais format.\nEx : **" + botInfos.prefix + "team send __id__ msg** attendu.");
            return (0);
        }
        var msg = message.content.substring(botInfos.prefix.length + name.length + 6 + id.length + 1);
        if (msg.length == 0)
        {
            message.reply(" mauvais format.\nEx : **" + botInfos.prefix + "team send id __msg__** attendu.");
            return (0);
        }
        let team = extra.team_center.getTeamById(id);
        if (team == undefined)
        {
            message.reply(" aucune Team ne correspond à cet **ID** \:thinking:");
            return (0);
        }
        let guild = extra.bot.guilds.find(guild => guild.id == team.author.guildId);
        let member;
        if (guild == undefined || (member = guild.members.find(memb => memb.user.id == team.author.id)) == undefined)
        {
            message.reply(" le propriétaire de cette **Team** est introuvable \:thinking:");
            return (0);
        }
        member.createDM().then(function(channel) {
            let finalMsg = `Bonjour **${member.user}**,\n`;
            finalMsg += `**${message.author}** du serveur **` + message.guild.name + "** vous a envoyé ce message en **réponse** à votre **Team** :\n\n";
            finalMsg += "*" + msg + "*\n\n";
            finalMsg += "- OverLead";
            channel.send(finalMsg);
        }).catch(err => botInfos.log("Erreur lors d'un MP à un proprietaire de Team : " + err));
        return (0);
    }
    if (KW_id == 7)
    {
        if (message.mentions.users.size == 0)
        {
            message.reply(" vous devez me mentionner quelqu'un \:thinking:");
            return (0);
        }
        let user = message.mentions.users.first();
        let team = extra.team_center.getTeam(user);
        if (team == undefined)
            message.reply(" cette personne n'a actuellement pas de **Team**.");
        else
            message.reply(team.print(extra.bot.guilds, extra.botInfos.guilds.find(bGuild => bGuild.id == message.channel.guild.id).tag));
        return (0);
    }
    return (0);
}

var team = new Cmd(name, description, func);

module.exports = team;