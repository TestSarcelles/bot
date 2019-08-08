const LightUser = require("./light_user.js");
const Discord = require("discord.js");
const BotInfos = require("../bot_infos.js");

var botInfos = new BotInfos();

class CV
{
    constructor(author, guildId, id)
    {
        this.author = new LightUser(author.id, guildId, author.username);
        this.infos = {
            "peak": null,
            "rank": null,
            "role": null,
            "heros": null,
            "description": null,
            "dispo": true
        };
        this.id = id;
        this.setFunc = {
            "peak": this.setPeak,
            "rank": this.setRank,
            "role": this.setRole,
            "heros": this.setHeros,
            "description": this.setDescription,
            "dispo": this.setDispo
        };
    }

    setField(field, value)
    {
        return (this.setFunc[field](value, this.infos));
    }

    setPeak(peak, infos)
    {
        if (peak == undefined || peak.length > 3 || !peak.match(/^([0-4][k][0-9])$/))
            return (" mauvais format. **__x__k__y__** attendu (**x** compris entre **0 et 4**, et **y** compris entre **0 et 9**).");
        infos["peak"] = peak;
        return (" le **peak** de votre **CV** à bien été mis à jour ! \:sunglasses:");
    }

    setRank(rank, infos)
    {
        if (rank == undefined)
            return (" vous ne m'avez pas précisé votre rang \:thinking:");
        infos["rank"] = rank;
        return (" le **rank** de votre **CV** à bien été mis à jour ! \:sunglasses:");
    }

    setRole(role, infos)
    {
        if (role.length == 0)
            return (" vous ne m'avez pas précisé votre rôle \:thinking:");
        if (role.toLowerCase() != "dps" && !role.toLowerCase().match(/(coach|manager|dps|((main|off) (tank|heal)))/))
            return (" mauvais format, soit **coach**, soit **manager**, soit **dps**, soit **main** ou **off** suivi de **heal** ou **tank** attendu.")
        infos["role"] = role;
        return (" le **role** de votre **CV** à bien été mis à jour ! \:sunglasses:");
    }

    setHeros(heros, infos)
    {
        if (heros == undefined || heros.length == 0)
            return (" vous ne m'avez pas précisé vos héros \:thinking:");
        heros = heros.toLowerCase().trim();
        let herosCheck = heros.split(" ");
        for (var heroCheck of herosCheck)
        {
            if (botInfos.heros.find(hero => hero == heroCheck) == undefined)
                return (" les nom des héros sont incorrects. Les noms doivent être **complets**, en **anglais** et **sans accent**.\nLes **exceptions** sont les suivantes : **soldier** pour soldat:76, **hammond** pour bouldozer.");
        }
        infos["heros"] = heros;
        return (" les **heros** de votre **CV** à bien été mis à jour ! \:sunglasses:");
    }

    setDescription(desc, infos)
    {
        if (desc.length == 0)
            return (" vous ne m'avez pas précisé votre description \:thinking:");
        infos["description"] = desc;
        return (" la **description** de votre **CV** à bien été mise à jour ! \:sunglasses:");
    }

    setDispo(dispo, infos)
    {
        if (dispo == undefined || (dispo != "oui" && dispo != "non"))
            return (" mauvais format, **oui** ou **non** attendu.");
        infos["dispo"] = ((dispo == "oui") ? true : false);
        return (" la **disponibilité** de votre **CV** à bien été mise à jour ! \:sunglasses:");
    }

    print()
    {
        let cv = new Discord.RichEmbed()
            .setColor("#fcb268")
            .setTitle("**CV de __`" + this.author.name + "`__ :**")
            .setThumbnail("https://hostpic.xyz/files/15649181173532744656.jpg");
        for (var info in this.infos)
        {
            if (info == "dispo")
                cv.addField("**" + info + " :**", ((this.infos[info] == true) ? "oui" : "non"), true);
            else
                cv.addField("**" + info + " :**", ((this.infos[info] != null) ? this.infos[info] : "/"), true);
        }
            
        cv.setFooter("ID: " + this.id);
        return (cv);
    }
}

module.exports = CV;