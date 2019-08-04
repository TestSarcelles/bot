var fs = require('fs');
var path = require("path");
const Discord = require('discord.js');
const BotInfos = require("../bot_infos.js");
const CV = require("./cv.js");

class CvCenter
{
    constructor()
    {
        this.bInf = new BotInfos();
        this.cvs = [];
        this.nextId = 0;
        this.jsonCvsFile = path.join(__dirname, "..", "JSON", "cvs.json");
        
        this.cvFields = [
            {name: "peak", description: "La plus haute côte atteinte. Format: **__x__k__y__** (**x** compris entre **0 et 4**, et **y** compris entre **0 et 9**)"},
            {name: "rank", description: "Le rang actuel"},
            {name: "role", description: "Le role joué. Format: soit **coach**, soit **manager**, soit **dps**, soit **off** ou **main** suivi **heal** ou **tank**"},
            {name: "heros", description: "Les héros que vous jouez principalement. Ex: **winston zarya**. *écrivez le nom complet et en anglais*"},
            {name: "description", description: "Votre description de joueur, vous pouvez préciser votre role ou parler de vos expériences"},
            {name: "dispo", description: "si vous êtes actuellement disponible. Format: **oui** ou **non**"}
        ];
        
        let setDescription = "Permet de completer son CV, en indiquant le champs à remplir ainsi que le contenu souhaité.\n";
        setDescription += "Ex : **" + this.bInf.prefix + "cv set __heros__ __winston dva__**.\n"
        setDescription += "Voici la liste des **fields** disponibles :\n";
        setDescription += this.getFields();
        let findDescription = "Permet de trouver les CV correspondant à votre recherche, au format : **" + this.bInf.prefix + "cv find __field__:__value__ ; __field__:__value__ ; ect ...**\n";
        findDescription += "Ex : **" + this.bInf.prefix + "cv find peak : 2k ; role : off heal** va **lister tous les CV** ayant un peak comprenant **2k** (donc de 2k à 2k9) et ayant un role de **off heal**"
        this.keyWords = [
            {name: "help", description: "Liste **toutes les options disponibles** de la commande **cv**"},
            {name: "create", description: "Permet de **créer son CV**, qu'il faudra ensuite **completer** gâce à la commande **" + this.bInf.prefix + "cv set __field__ __value__**."},
            {name: "set", description: setDescription},
            {name: "delete", description: "Permet de **supprimer le CV** correspondant à l'**ID** indiqué, __**si vous êtes son créateur ou au moins modérateur**__.\nEx : **" + this.bInf.prefix + "cv delete __2__**"},
            {name: "find", description: findDescription},
            {name: "list", description: "Permet de **lister** tous les CV existants."},
            {name: "send", description: "Permet **d'envoyer un MP** au propriétaire du CV, pensez à lui indiquer un moyen de vous recontacter.\nFormat : **" + this.bInf.prefix + "cv send __ID__ __msg__**"},
            {name: "see", description: "Permet de **consulter le CV** de la personne **mentionnée**.\nFormat : **" + this.bInf.prefix + "cv see \@user**"}
        ]
    }

    getKeyWordId(keyWord)
    {
        let i = 0;
        for (var KW of this.keyWords)
        {
            if (keyWord == KW.name)
                return (i);
                
            i++;
        }
        return (-1);
    }

    getKeyWords()
    {
        let KWs = "";
        this.keyWords.forEach(KW => {
            KWs += "- **" + KW.name + "**\n";
        });
        return (KWs);
    }

    getFields()
    {
        let fields = "";
        this.cvFields.forEach(field => {
            fields += "- __**" + field.name + "**__ | " + field.description + "\n";
        });
        return (fields);
    }

    checkField(field)
    {
        for (var f of this.cvFields)
        {
            if (field == f.name)
                return (1);
        }
        return (-1);
    }

    getNewId()
    {
        return (this.nextId);
    }

    sendHelp(member)
    {
        let help = new Discord.RichEmbed()
            .setColor('#fcb268')
            .setTitle("Voici la liste des **options disponibles** pour la commande __**cv**__ :")
            .setThumbnail("https://hostpic.xyz/files/15649181173532744656.jpg");
        this.keyWords.forEach(KW => {
            help.addField("**" + KW.name + "**", KW.description, true);
        }); 
        help.setFooter("Créé par IdCom4#8964");
        member.createDM().then(function (channel) {
            channel.send(help).catch(err => this.bInf.log("Erreur lors d'un sendHelp cv : " + err));
        }).catch(err => this.bInf.log("Erreur lors de l'envoie du $cv help à un membre : " + err));
        return (" l'aide vous à été envoyée \:sunglasses:");
    }

    listCvs(message, extra)
    {
        let channel = message.channel;
        let tag = extra.botInfos.guilds.find(bGuild => bGuild.id == message.channel.guild.id).tag;
        if (this.cvs.length == 0)
            return (channel.send("Il n'y a **actuellement** aucun **CV** !").catch(err => this.bInf.log("Erreur lors d'un send cv_center : " + err)));
        if (this.cvs.length == 1)
            channel.send("Voici le seul **CV** actuel :").catch(err => this.bInf.log("Erreur lors d'un send cv_center : " + err));
        else
            channel.send("Voici la liste des **" + this.cvs.length + "** CV actuels :").catch(err => this.bInf.log("Erreur lors d'un send cv_center : " + err));
        this.cvs.forEach(cv => {
            channel.send(cv.print(extra.bot.guilds, tag).catch(err => this.bInf.log("Erreur lors du send list cv_center : " + err)));
        });
    }

    findCvs(criterias)
    {
        let matchingCvs = [];
        this.cvs.forEach(cv => {
            let match = true;
            for (var criteria of criterias)
            {
                if (criteria.field == "peak" && cv.infos["peak"] != null)
                {
                    let max = criteria.value.split("k")[0];
                    let min = criteria.value.split("k")[1];
                    if (parseInt(cv.infos["peak"].split("k")[0]) != max || (min != undefined && parseInt(cv.infos["peak"].split("k")[1]) < min))
                        match = false;
                }
                else if (criteria.field == "heros" && cv.infos["heros"] != null)
                {
                    let heros = criteria.value.trim().split(" ");
                    for (var hero of heros)
                    {
                        if (!cv.infos["heros"].includes(hero))
                        {
                            match = false;
                            break;
                        }
                    }
                }
                else if (criteria.field == "dispo" && cv.infos["dispo"] != null)
                {
                    if ((criteria.value == "oui" && cv.infos["dispo"] == false) || (criteria.value == "non" && cv.infos["dispo"] == true))
                        match = false;
                }
                else if (cv.infos[criteria.field] == null || !cv.infos[criteria.field].toLowerCase().includes(criteria.value.toLowerCase()))
                    match = false
            }
            if (match)
                matchingCvs.push(cv);
        });
        return (matchingCvs);
    }

    printSearch(message, extra, criterias)
    {
        let channel = message.channel;
        let tag = extra.botInfos.guilds.find(bGuild => bGuild.id == message.channel.guild.id).tag;
        channel.send("Voici le **résultat** de votre recherche :").catch(err => this.bInf.log("Erreur lors d'un send cv_center : " + err));
        let matchingCvs = this.findCvs(criterias);
        matchingCvs.forEach(cv => {
            channel.send(cv.print(extra.bot.guilds, tag))
        });
        if (matchingCvs.length == 0)
            channel.send("Aucun **CV** ne correspond à votre recherche.").catch(err => this.bInf.log("Erreur lors d'un send cv_center : " + err));
    }

    addCv(cv)
    {
        this.cvs.push(cv);
        this.nextId += 1;
        this.saveCvs();
        return (" votre **CV** à bien été créé, l'ID temporaire **" + cv.id + "** lui à été attribuée \:sunglasses:");
    }

    deleteCv(message, id)
    {
        var nbrCvs = this.cvs.length;

        for (var i = 0; i < nbrCvs; i++)
        {
            if (this.cvs[i].id == id)
            {
                if (this.cvs[i].author.id != message.author.id && (!message.member.hasPermission("KICK_MEMBERS") || message.channel.guild.id != this.cvs[i].author.guildId))
                    return (" vous n'avez __**pas la permission**__ de supprimer ce CV \:frowning:")
                this.cvs.splice(i, 1);
                this.saveCvs();
                return (" le **CV** à bien été supprimé !");
            } 
        }
        return (" aucun **CV** ne correspond à cet **ID** \:thinking:");
    }

    getCv(user)
    {
        return (this.cvs.find(cv => cv.author.id == user.id));
    }

    getCvById(id)
    {
        return (this.cvs.find(cv => cv.id == id));
    }

    loadCvs()
    {
        let rawData = fs.readFileSync(this.jsonCvsFile);
        let jsonCvs = JSON.parse(rawData);

        if (jsonCvs == null)
            return ;
        let i = 0;
        jsonCvs.forEach(jsonCv => {
            let author = {
                id: jsonCv.author.id,
                username: jsonCv.author.name
            }
            let cv = new CV(author, jsonCv.author.guildId, i);
            for (var inf in jsonCv.infos)
                cv.infos[inf] = jsonCv.infos[inf];
                
            this.cvs.push(cv);
            i++;
        });
        this.nextId = i;
    }
    
    saveCvs()
    {
        this.bInf.log("Sauvegarde des CVs en cours ...");
        if (this.cvs.length == 0)
            fs.writeFile(this.jsonCvsFile, null, (err) => {if (err) throw err; this.bInf.log('jsonCvs set à null');});
        else
        {
            let data = JSON.stringify(this.cvs, null, 2);
            fs.writeFile(this.jsonCvsFile, data, (err) => {if (err) throw err; this.bInf.log('CVs sauvegardés');});
        }
    }

}

module.exports = CvCenter;