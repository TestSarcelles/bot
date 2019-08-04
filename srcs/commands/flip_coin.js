const Cmd = require("../class/cmd.js");

var name = "flip_coin";

var description = "Lance une **pièce**, et vous dit si **le résultat est pile, ou face**.";

var func = function (message, extra)
{
    let channel = message.channel;

    let coin = Math.round(Math.random() * 10) % 2;
    coin = extra.bot.emojis.get(extra.emojis[((coin == 0) ? "face_coin" : "pile_coin")]);
    channel.send(`${coin}`);
}

var flip_coin = new Cmd(name, description, func);

module.exports = flip_coin;