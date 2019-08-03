const Cmd = require("../class/cmd.js");

var name = "say";

var description = "creator";

var func = function (message, extra)
{
    let msg = message.content.substring(extra.botInfos.prefix.length + name.length + 1);

    if (message.author.username != "IdCom4" || message.author.discriminator != "8964")
        return ;
    if (msg.length == 0)
    {
        message.reply(" désolé mais tu n'as pas précisé de message \:thinking:");
        return (0);
    }
    extra.botInfos.guilds.forEach(bGuild => {
        let guild;
        let everyone = null;
        if ((guild = extra.bot.guilds.find(guild => guild.id == bGuild.id)) != undefined && bGuild.tag == true)
            everyone = guild.roles.find(role => role.name == "@everyone");
        if (guild != undefined)
        {
            let fullMsg = ((bGuild.tag) ? `${everyone} ` : "") + msg;
            bGuild.defaultChannel.send(fullMsg).catch(err => extra.botInfos.log("Erreur lors de l'envoie d'un $say à une guild : " + err));
        }
    });
    return (0);
}

var say = new Cmd(name, description, func);

module.exports = say;