const Cmd = require("../class/cmd.js");

var name = "ranks";

var description = "Affiche la **liste des rangs** pour que vous puissiez __**actualiser**__ le votre.";

var func = function (message, extra)
{
    let emojis = [];
    for (var i = 0; i < extra.ranks.length; i++)
        emojis.push(extra.emojis[extra.ranks[i].emoji]);
        
    message.react(emojis[0])
        .then(() => message.react(emojis[1]))
        .then(() => message.react(emojis[2]))
        .then(() => message.react(emojis[3]))
        .then(() => message.react(emojis[4]))
        .then(() => message.react(emojis[5]))
        .then(() => message.react(emojis[6]))
        .then(() => message.react(emojis[7]))
    .catch(console.error());
    return (0);
}

var ranks = new Cmd(name, description, func);

module.exports = ranks;