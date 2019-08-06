const LightUser = require("./light_user.js");
const Discord = require("discord.js");
const BotInfos = require("../bot_infos.js");

var botInfos = new BotInfos();

class Team
{
    constructor(author, guildId, id)
    {
        this.author = new LightUser(author.id, guildId, author.username);
        this.infos = {
            "name": null,
            "rank": null,
            "description": null,
            "objectifs": null,
            "new": true,
            "wantedPlayers": []
        };
        this.id = id;
        this.setFunc = {
            "name": this.setName,
            "rank": this.setRank,
            "description": this.setDescription,
            "objectifs": this.setobjectifs,
            "new": this.setNew,
            "wantedPlayers": this.setWantedPlayers
        };
    }

    setField(field, value)
    {
        return (this.setFunc[field](value, this.infos));
    }

    setName(name, infos)
    {
        if (name == undefined || name.length == 0)
            return (" vous devez me préciser un nom \:thinking:");
        infos["name"] = name;
        return (" le **nom** de votre **team** à bien été mis à jour ! \:sunglasses:");
    }

    setRank(rank, infos)
    {
        if (rank == undefined || !rank.match(/([0-4][k][0-9])/))
            return (" mauvais format. **__x__k__y__** attendu (**x** compris entre **0 et 4**, et **y** compris entre **0 et 9**).");
        infos["rank"] = rank;
        return (" le **rank** de votre **team** à bien été mis à jour ! \:sunglasses:");
    }

    setDescription(desc, infos)
    {
        if (desc.length == 0)
            return (" vous ne m'avez pas précisé votre description \:thinking:");
        infos["description"] = desc;
        return (" la **description** de votre **team** à bien été mise à jour ! \:sunglasses:");
    }

    setobjectifs(objectifs, infos)
    {
        if (desc.length == 0)
            return (" vous ne m'avez pas précisé vos objectifs \:thinking:");
        infos["objectifs"] = objectifs;
        return (" les **objectifs** de votre **team** ont bien été mis à jour ! \:sunglasses:");
    }

    setNew(_new, infos)
    {
        if (_new == undefined || (_new != "oui" && _new != "non"))
            return (" mauvais format, **oui** ou **non** attendu.");
        infos["new"] = ((_new == "oui") ? true : false);
        return (" la **nouveauté** de votre **team** à bien été mise à jour ! \:sunglasses:");
    }

    setWantedPlayers(wantedPlayers, infos)
    {
        let wrongFormat = " mauvais format. **__role__ : __le role__ , __heros__ : __les héros__ ; etc ...** attendu (une **paire** par joueur voulu, séparées par des **;** s'il y en a plusieurs)";
        if (wantedPlayers.length == 0)
            return (wrongFormat);
        let wantedPlayersCpy = [];
        let wantedPlayersCheck = wantedPlayers.toLowerCase().split(";");
        for (var wantedPlayerCheck of wantedPlayersCheck)
        {
            if (!wantedPlayerCheck.match(/ *((\w*): *(\w.*), *(\w.*): *(\w.*))/))
                return (wrongFormat);
            let _role = wantedPlayerCheck.split(",")[0].toLowerCase();
            let Rfield = _role.split(":")[0].trim();
            let Rval = _role.split(":")[1].trim();
            let _heros = wantedPlayerCheck.split(",")[1].toLowerCase();
            let Hfield = _heros.split(":")[0].trim();
            let Hval = _heros.split(":")[1].trim();
            if (Rfield != "role" || (Rval != "dps" && !Rval.match(/(coach|manager|dps|((main|off) (tank|heal)))/)))
                return (" mauvais format pour **role**. __**role**__ : (soit **coach**, soit **manager**, **dps**, soit **main** ou **off** suivi de **heal** ou **tank**) attendu.");
            if (Hfield != "heros")
                return (" mauvais format pour **heros**. __**heros**__ : __le nom des héros complet et en anglais__ attendu, exception faite de : **soldier** pour soldat:76, **hammond** pour bouldozer.");
            let herosTab = Hval.split(" ");
            for (var heroT of herosTab)
            {
                if (botInfos.heros.find(hero => hero == heroT) == undefined)
                {
                    infos["wantedPlayers"] = [];
                    return (" les nom des héros sont incorrects. Les noms doivent être **complets**, en **anglais** et **sans accent**.\nLes **exceptions** sont les suivantes : **soldier** pour soldat:76, **hammond** pour bouldozer.");
                }
            }
            wantedPlayersCpy.push({role: Rval, heros: Hval});
        }
        infos["wantedPlayers"] = wantedPlayersCpy;
        return (" la liste de **profils recherchés** de votre **team** à bien été mise à jour ! \:sunglasses:");
    }

    print()
    {
        let team = new Discord.RichEmbed()
            .setColor("#fcb268")
            .setTitle("__**" + this.infos["name"] + "**__")
            .setThumbnail("https://hostpic.xyz/files/15649181173532744656.jpg");
        for (var info in this.infos)
        {
            if (info == "new")
                team.addField("**Nouvelle équipe :**", ((this.infos[info] == true) ? "oui" : "non"), true);
            else if (info == "wantedPlayers")
            {
                let wantedPlayers = "";
                for (var wantedPlayer of this.infos["wantedPlayers"])
                    wantedPlayers += "**role** : " + wantedPlayer.role + " | **héros joués** : " + wantedPlayer.heros + "\n";
                team.addBlankField();
                team.addField("**Profils recherchés :**", ((wantedPlayers != "") ? wantedPlayers : "/"), true);
            }
            else if (info != "name")
                team.addField("**" + info + " :**", ((this.infos[info] != null) ? this.infos[info] : "/"), true);
        } 
        team.setFooter("ID: " + this.id);
        return (team);
    }
}

module.exports = Team;