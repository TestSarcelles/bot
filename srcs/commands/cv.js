const BotInfos = require("../bot_infos.js");
const CV = require("../class/cv.js");
const Cmd = require("../class/cmd.js");

const botInfos = new BotInfos();

var delimitor = ";"

var name = "cv";

var description = "Permet de **gérer votre CV** ainsi que rechercher ceux des autres.\n";
description += "Faites __**" + botInfos.prefix +"cv help**__ pour connaitre les **commandes**.";

var func = function (message, extra)
{
    var key_word = message.content.split(" ")[1];
    var KW_id = extra.cv_center.getKeyWordId(key_word);

    if (KW_id < 0)
    {
        message.reply(" mot clé de la commande **cv** invalide \:thinking:\nMots clés **disponibles** :\n" + extra.cv_center.getKeyWords());
        return (0);
    }
    if (KW_id == 0)
    {
        message.reply(extra.cv_center.sendHelp(message.member));
        return (0);
    }
    if (KW_id == 1)
    {
        if (extra.cv_center.getCv(message.author) != undefined)
        {
            message.reply(" vous possedez déjà un **CV** \:thinking:");
            return (0);
        }
        var newCV = new CV(message.author, message.channel.guild.id, extra.cv_center.getNewId());
        message.reply(extra.cv_center.addCv(newCV));
        return (0);
    }
    if (KW_id == 2)
    {
        var field = message.content.split(" ")[2];
        if (field == undefined || extra.cv_center.checkField(field) == -1)
        {
            message.reply(" mauvais champs, voici la liste des **champs** disponibles :\n" + extra.cv_center.getFields());
            return (0);
        }
        var value = message.content.substring(botInfos.prefix.length + name.length + 5 + field.length + 1);
        //var value = message.content.substring(botInfos.prefix.length);
        if (value.length == 0)
        {
            message.reply(" mauvais format.\nEx : **" + botInfos.prefix + "cv set champs __valeur__** attendu.");
            return (0);
        }
        var cv = extra.cv_center.getCv(message.author);
        if (cv == undefined)
            message.reply(" vous n'avez actuellement **pas de CV** \:thinking:");
        else
            message.reply(cv.setField(field, value));
        extra.cv_center.saveCvs();
        return (0);
    }
    if (KW_id == 3)
    {
        var id = message.content.split(" ")[2];
        if (id == undefined)
        {
            message.reply(" mauvais format.\nEx : **" + botInfos.prefix + "cv delete __id__** attendu.");
            return (0);
        }
        message.reply(extra.cv_center.deleteCv(message, id));
        return (0);
    }
    if (KW_id == 4)
    {
        let search = message.content.substring(botInfos.prefix.length + name.length + 6);
        if (search.length == 0)
        {
            message.reply(" mauvais format.\nEx : **" + botInfos.prefix + "cv find __champs__:__valeur__ ; ect ...** attendu (au moins une paire **champs:valeur**, séparées par des **;** s'il y en a plusieurs).");
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
                goodFormat = expr.match(/((peak|rank|role|heros|description|dispo):(\w.*))/);
            }
            if (!goodFormat)
            {
                message.reply(" mauvais format.\nEx : **" + botInfos.prefix + "cv find __champs__:__valeur__ ; ect ...** attendu (au moins une paire **champs:valeur**).");
                return (0);
            }
            criterias.push({field: _field, value: _value});
        }
        extra.cv_center.printSearch(message, extra, criterias)
    }
    if (KW_id == 5)
        extra.cv_center.listCvs(message, extra)
    if (KW_id == 6)
    {
        var id = message.content.split(" ")[2];
        message.delete().catch(err => botInfos.log("Erreur lors d'un msg.delete() cv : " + err));
        if (id == undefined)
        {
            message.reply(" mauvais format.\nEx : **" + botInfos.prefix + "cv send __id__ msg** attendu.");
            return (0);
        }
        var msg = message.content.substring(botInfos.prefix.length + name.length + 6 + id.length + 1);
        if (msg.length == 0)
        {
            message.reply(" mauvais format.\nEx : **" + botInfos.prefix + "cv send id __msg__** attendu.");
            return (0);
        }
        let cv = extra.cv_center.getCvById(id);
        if (cv == undefined)
        {
            message.reply(" aucun CV ne correspond à cet **ID** \:thinking:");
            return (0);
        }
        let guild = extra.bot.guilds.find(guild => guild.id == cv.author.guildId);
        let member;
        if (guild == undefined || (member = guild.members.find(memb => memb.user.id == cv.author.id)) == undefined)
        {
            message.reply(" le propriétaire de ce **CV** est introuvable \:thinking:");
            return (0);
        }
        member.createDM().then(function(channel) {
            let finalMsg = `Bonjour **${member.user}**,\n`;
            finalMsg += "**`" + message.member.user + "`** du serveur **" + message.guild.name + "** vous a envoyé ce message en **réponse** à votre **CV** :\n\n";
            finalMsg += "*" + msg + "*\n\n";
            finalMsg += "- OverLead";
            channel.send(finalMsg).catch(err => botInfos.log("Erreur lors d'un MP à un proprietaire de CV : " + err));
        }).catch(err => botInfos.log("Erreur lors de la creation d'un MP : " + err));
        return (0);
    }
    if (KW_id == 7)
    {
        if (message.mentions.users.size == 0)
        {
            message.reply(" vous devez me mentionner quelqu'un \:thinking:").catch(err => botInfos.log("Erreur lors d'un send CV : " + err));
            return (0);
        }
        let user = message.mentions.users.first();
        let cv = extra.cv_center.getCv(user);
        if (cv == undefined)
            message.reply(" cette personne n'a actuellement pas de **CV**.");
        else
            message.reply(cv.print());
        return (0);
    }
    return (0);
}

var cv = new Cmd(name, description, func);

module.exports = cv;