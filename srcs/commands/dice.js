const Cmd = require("../class/cmd.js");

var name = "dice";

var description = "Jette un **dé** de la **valeur spécifiée** et vous donne le résultat.";

var func = function(message, extra)
{
    var dice_val = message.content.split(" ")[1];

    if (dice_val != undefined)
        dice_val = parseInt(dice_val, 10);
    if (dice_val == undefined || isNaN(dice_val) || dice_val < 1 || dice_val > 1000)
    {

        message.channel.send("T'as donné une mauvaise valeur à ton dé \:thinking:\nEx : **" + extra.botInfos.prefix + name + " x** (x compris entre 1 et 1000)");
        return (0);
    }
    let dice = Math.floor(Math.random() * 1000) % dice_val + 1;
    message.channel.send("**" + dice + "** !");
    return (0);
}

var dice = new Cmd(name, description, func);

module.exports = dice;