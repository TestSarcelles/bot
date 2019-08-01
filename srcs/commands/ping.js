const Cmd = require("../class/cmd.js");

var name = "why";

var description = "**Pourquoi** ? :o";

var func = function (message, extra)
{
    //message.channel.send("**Amuse toi bien !** \:smile:");
    message.channel.send("**PARCE QUE C'EST NOTRE PROJET !!!!!!**");
    return (0);
}

var ping = new Cmd(name, description, func);

module.exports = ping;