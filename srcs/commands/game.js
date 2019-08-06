const Cmd = require("../class/cmd.js");

var name = "game";

var description = "Liste toutes les personnes jouant au **jeu spécifié**.";

var func = function (message, extra)
{
    var members = message.channel.guild.members;
    var game = message.content.substring(extra.botInfos.prefix.length + name.length + 1);
    var tag = extra.botInfos.guilds.find(bGuild => bGuild.id == message.channel.guild.id).tag;

    if (message.content.split(" ")[1] == undefined || message.content.split(" ")[1] == null)
    {
        message.reply(" il faudrait me préciser un jeu \:thinking:");
        return (0);
    }
    let i = 0;
    let str = "Alors, voici la liste des gens jouant actuellement à __**" + game + "**__ :\n";
    if (members != null)
    {
        members.forEach(member => {
            if (member.presence.game == game)
            {
                i++;
                str = str + ((tag) ? `- **${member.user}**\n` : "- **" + member.user.username + "**\n");
            }
        });
    }
    if (i == 0)
        str += "- **Personne** ne joue à ce jeu pour l'instant !";
        message.channel.send(str);
    return (0);
}

var game = new Cmd(name, description, func);

module.exports = game;