
class Morpion {
    constructor () {
        this.plateau = [[0, 0, 0],
                        [0, 0, 0],
                        [0, 0, 0]];
        this.turn = 1;
        this.onGame = 1;
        this.free_cases = 9;
    }

    isOver() {
        for (var y = 0; y < 3; y++)
        {
            var lastValY = this.plateau[0][y];
            var lastValX = this.plateau[y][0];
            for (var x = 0; x < 3; x++)
            {
                if (this.plateau[y][x] != lastValX || this.plateau[y][x] == 0)
                    lastValX = -1;
                if (this.plateau[x][y] != lastValY || this.plateau[x][y] == 0)
                    lastValY = -1;
            }
            if(lastValX != -1 || lastValY != -1)
                return (this.turn);
        }
        if ((this.plateau[0][0] == this.plateau[1][1] && this.plateau[0][0] == this.plateau[2][2] && this.plateau[0][0] != 0)
        || (this.plateau[0][2] == this.plateau[1][1] && this.plateau[0][2] == this.plateau[2][0] && this.plateau[0][2] != 0))
            return (this.turn);
        return (0);
    }

    nextTurn() {
        this.turn = (this.turn == 1) ? 2 : 1;
    }
    
    print_plateau(extra, user, guildName) {
        var grid = "°     *1  2  3*\n";
        for (var y = 0; y < 3; y++)
        {
            var line = [' ', ' ', ' '];
            for (var x = 0; x < 3; x++)
                line[x] = (this.plateau[y][x] == 0) ? ' ' : (this.plateau[y][x] == 1) ? 'X' : 'O';
            grid = grid + "*" + (y + 1) + ((y + 1 == 1) ? "*     **" : "*    **") + ((line[0] == ' ') ? "   " : line[0]) + "**|**" + ((line[1] == ' ') ? "   " : line[1]) + "**|**" + ((line[2] == ' ') ? "   " : line[2]) + "**\n";
        }
        grid = grid + "°\n";
        extra.botInfos.guilds.forEach(bGuild => {
            if (bGuild.blockedCmds.find(blockedCmd => blockedCmd == "morpion") == undefined)
                bGuild.sendOnChannel("`"+ user.username + "` sur **" + guildName + "** à joué :\n" + grid, "games");
        });
        //channel.send(grid)
    }

    put_morpion(y, x, channel, extra, user) {
        y -= 1;
        x -= 1;
        if ((y < 0 || y > 2 || x < 0 || x > 2)
        || this.plateau[y][x] != 0)
        {
            channel.send("Mauvaises coordonnées \:thinking:")
            return (-1);
        }
        this.plateau[y][x] = this.turn;
        this.free_cases -= 1;
        this.print_plateau(extra, user, channel.guild.name);
        if (this.free_cases == 0)
        {
            const bronze = extra.bot.emojis.get(extra.emojis["bronze"]);
            extra.botInfos.guilds.forEach(bGuild => {
                if (bGuild.blockedCmds.find(blockedCmd => blockedCmd == "morpion") == undefined)
                    bGuild.sendOnChannel(`**Egalité** ... ${bronze}`, "games");
            });
            this.onGame = 0;
            return (this.turn);
        }
        if (this.isOver() > 0)
        {
            const top500 = extra.bot.emojis.get(extra.emojis["top500"]);
            extra.botInfos.guilds.forEach(bGuild => {
                if (bGuild.blockedCmds.find(blockedCmd => blockedCmd == "morpion") == undefined)
                    bGuild.sendOnChannel("**Victoire** du joueur " + this.turn + ` ${top500}`, "games");
            });
            this.onGame = 0;
            return (this.turn);
        }  
        this.nextTurn();
        extra.botInfos.guilds.forEach(bGuild => {
            if (bGuild.blockedCmds.find(blockedCmd => blockedCmd == "morpion") == undefined)
                bGuild.sendOnChannel("Au tour du **joueur " + this.turn + "** \:smile:", "games");
        });
        return (0);
    }
}

module.exports = Morpion;