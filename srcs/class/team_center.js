var fs = require('fs');
var path = require("path");
const Discord = require('discord.js');
const BotInfos = require("../bot_infos.js");
const Team = require("./team.js");

class TeamCenter
{
    constructor()
    {
        this.bInf = new BotInfos();
        this.teams = [];
        this.nextId = 0;
        this.jsonTeamsFile = path.join(__dirname, "..", "JSON", "teams.json");
        
        this.cvFields = [
            {name: "name", description: "Le nom de l'équipe"},
            {name: "rank", description: "Le rang de l'équipe. Format: **__x__k__y__** (**x** compris entre **0 et 4**, et **y** compris entre **0 et 9**)"},
            {name: "description", description: "La description de votre équipe, son statut, ses partenaires, etc ..."},
            {name: "objectifs", description: "Les **objectifs** de l'équipe, les tournois, ou la ranked entre amis par exemple"},
            {name: "new", description: "Si votre équipe est nouvelle et en construction, ou non"},
            {name: "wantedPlayers", description: "La liste des joueurs que vous recherchez, au format **__role__ : le role , __heros__ : les héros** pour chaque joueur, séparés par des **;** s'il y en a plusieurs"}
        ];
        
        let setDescription = "Permet de completer sa team, en indiquant le champs à remplir ainsi que le contenu souhaité.\n";
        setDescription += "Ex : **" + this.bInf.prefix + "team set __rank__ __2k5__** ou **" + this.bInf.prefix + "team set __wantedPlayers__ __role__ : dps , __heros__ : genji sombra**\n"
        setDescription += "Voici la liste des **fields** disponibles :\n";
        setDescription += this.getFields();
        let findDescription = "Permet de trouver les Teams correspondant à votre recherche, au format : **" + this.bInf.prefix + "team find __field__:__value__ ; __field__:__value__ ; ect ...**\n";
        findDescription += "Ex : **" + this.bInf.prefix + "team find __role__ : off heal ; rank : 2k5** va **lister toutes les Teams** cherchant un off heal de rang 2k5 ou plus"
        this.keyWords = [
            {name: "help", description: "Liste **toutes les options disponibles** de la commande **team**"},
            {name: "create", description: "Permet de **créer sa Team** en indiquant son **nom**, qu'il faudra ensuite **completer** gâce à la commande **" + this.bInf.prefix + "team set __field__ __value__**."},
            {name: "set", description: setDescription},
            {name: "delete", description: "Permet de **supprimer la Team** correspondant à l'**ID** indiqué, __**si vous êtes son créateur ou au moins modérateur**__.\nEx : **" + this.bInf.prefix + "team delete __2__**"},
            {name: "find", description: findDescription},
            {name: "list", description: "Permet de **lister** toutes les Teams existantes."},
            {name: "send", description: "Permet **d'envoyer un MP** au propriétaire de la Team, pensez à lui indiquer un moyen de vous recontacter.\nFormat : **" + this.bInf.prefix + "team send __ID__ __msg__**"},
            {name: "see", description: "Permet de **consulter la Team** de la personne **mentionnée**.\nFormat : **" + this.bInf.prefix + "team see \@user**"}
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
            .setTitle("Voici la liste des **options disponibles** pour la commande __**team**__ :")
            .setThumbnail("https://hostpic.xyz/files/15649181173532744656.jpg");
        this.keyWords.forEach(KW => {
            help.addField("**" + KW.name + "**", KW.description, true);
        }); 
        help.setFooter("Créé par IdCom4#8964");
        member.createDM().then(function (channel) {
            channel.send(help).catch(err => this.bInf.log("Erreur lors de l'envoie du $cv help à un membre : " + err));
        }).catch(err => this.bInf.log("Erreur de la creation d'un DM : " + err));
        return (" l'aide vous à été envoyée \:sunglasses:");
    }

    listTeams(message, extra)
    {
        let channel = message.channel;
        let tag = extra.botInfos.guilds.find(bGuild => bGuild.id == message.channel.guild.id).tag;
        if (this.teams.length == 0)
            return (channel.send("Il n'y a **actuellement** aucune **Team** !"));
        if (this.teams.length == 1)
            channel.send("Voici la seule **Team** actuelle :");
        else
            channel.send("Voici la liste des **" + this.teams.length + "** Teams actuelles :");
        this.teams.forEach(team => {
            channel.send(team.print(extra.bot.guilds, tag));
        });
    }

    printSearch(message, extra, criterias)
    {
        let channel = message.channel;
        let tag = extra.botInfos.guilds.find(bGuild => bGuild.id == message.channel.guild.id).tag;
        let found = false;
        channel.send("Voici le **résultat** de votre recherche :");
        this.teams.forEach(team => {
            let match = true;
            for (var criteria of criterias)
            {
                if (criteria.field == "rank" && team.infos["rank"] != null)
                {
                    let max = criteria.value.split("k")[0];
                    let min = criteria.value.split("k")[1];
                    if (parseInt(team.infos["peak"].split("k")[0]) != max || (min != undefined && parseInt(team.infos["peak"].split("k")[1]) < min))
                        match = false;
                }
                else if (criteria.field == "heros" && team.infos["wantedPlayers"] != null)
                {
                    let heros = criteria.value.trim().split(" ");
                    for (var wantedPlayer of team.infos["wantedPlayers"])
                    {
                        match = true;
                        for (var hero of heros)
                        {
                            if (!wantedPlayer.heros.includes(hero))
                            {
                                match = false;
                                break;
                            }
                        }
                        if (match)
                            break;
                    }
                }
                else if (criteria.field == "role" && team.infos["wantedPlayers"] != null)
                {
                    for (var wantedPlayer of team.infos["wantedPlayers"])
                    {
                        if (wantedPlayer.role != criteria.value)
                            match = false;
                        else
                        {
                            match = true;
                            break;
                        }
                    }
                }
                else if (criteria.field == "new" && team.infos["new"] != null)
                {
                    if ((criteria.value == "oui" && team.infos["new"] == false) || (criteria.value == "non" && team.infos["new"] == true))
                        match = false;
                }
                else if (team.infos[criteria.field] == null || !team.infos[criteria.field].toLowerCase().includes(criteria.value.toLowerCase()))
                    match = false
            }
            if (match)
            {
                channel.send(team.print(extra.bot.guilds, tag));
                found = true;
            }
        });
        if (!found)
            channel.send("Aucune **Team** ne correspond à votre recherche.");
    }

    addTeam(team)
    {
        this.teams.push(team);
        this.nextId += 1;
        this.saveTeams();
        return (" votre **Team** à bien été créée, l'ID temporaire **" + team.id + "** lui à été attribuée \:sunglasses:");
    }

    deleteTeam(message, id)
    {
        var nbrteams = this.teams.length;

        for (var i = 0; i < nbrteams; i++)
        {
            if (this.teams[i].id == id)
            {
                if (this.teams[i].author.id != message.author.id && (!message.member.hasPermission("KICK_MEMBERS") || message.channel.guild.id != this.teams[i].author.guildId))
                    return (" vous n'avez __**pas la permission**__ de supprimer cette Team \:frowning:")
                this.teams.splice(i, 1);
                this.saveTeams();
                return (" la **Team** à bien été supprimée !");
            } 
        }
        return (" aucune **Team** ne correspond à cet **ID** \:thinking:");
    }

    getTeam(user)
    {
        return (this.teams.find(cv => cv.author.id == user.id));
    }

    getTeamById(id)
    {
        return (this.teams.find(cv => cv.id == id));
    }

    loadTeams()
    {
        let rawData = fs.readFileSync(this.jsonTeamsFile);
        let jsonTeams = JSON.parse(rawData);

        if (jsonTeams == null)
            return ;
        let i = 0;
        jsonTeams.forEach(jsonTeam => {
            let author = {
                id: jsonTeam.author.id,
                username: jsonTeam.author.name
            }
            let team = new Team(author, jsonTeam.author.guildId, i);
            for (var inf in jsonTeam.infos)
                team.infos[inf] = jsonTeam.infos[inf];
                
            this.teams.push(team);
            i++;
        });
        this.nextId = i;
    }
    
    saveTeams()
    {
        this.bInf.log("Sauvegarde des Teams en cours ...");
        if (this.teams.length == 0)
            fs.writeFile(this.jsonTeamsFile, null, (err) => {if (err) throw err; this.bInf.log('jsonTeams set à null');});
        else
        {
            let data = JSON.stringify(this.teams, null, 2);
            fs.writeFile(this.jsonTeamsFile, data, (err) => {if (err) throw err; this.bInf.log('Teams sauvegardés');});
        }
    }

}

module.exports = TeamCenter;