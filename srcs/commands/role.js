const Cmd = require("../class/cmd.js");

var name = "role";

var description = "Liste toutes les personnes ayant le **role spécifié**.";

var func = function (message, extra)
{
    var role_name = message.content.substring(extra.botInfos.prefix.length + name.length + 1);
    var roles = message.channel.guild.roles;
    var tag = extra.botInfos.guilds.find(bGuild => bGuild.id == guild.id).tag;

    if (message.content.split(" ")[1] == undefined || message.content.split(" ")[1] == null)
    {
        message.reply(" il faudrait me préciser un rôle \:thinking:");
        return (0);
    }
    let role = roles.find(role => role.name === role_name);
    if (role == undefined || role == null)
    {
        message.reply(" le rôle n'existe pas \:thinking:");
        return (0);
    }
    let i = 0;
    let membersWithRole = roles.find(role => role.name === role_name).members;
    let str = `Alors, voici la liste des gens ayant le rôle __**${role}**__ :\n`;
    membersWithRole.forEach(member => {
        i++;
        let game_activity = (member.presence.game == null) ? "Vie sa vie" : `Joue à **${member.presence.game}**`;
        str = str + "- **" + ((tag) ? `${member.user}` : member.user.username) + "** | " + game_activity + "\n";
    });
    if (i == 0)
        str += "- **Personne** n'a ce rôle pour l'instant !";
    message.channel.send(str);
    return (0);
}

var role = new Cmd(name, description, func);

module.exports = role;