class Power4 {
    constructor () {
        this.plateau = [[0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0]];
        this.turn = 1;
        this.onGame = 1;
        this.free_cases = 6 * 7;
    }

    check_diag(y, x, way)
    {
        var last = this.plateau[y][x];
        var nbr = 0;
        while (y < 6 && x < 7 && y >= 0 && x >= 0)
        {
            if (this.plateau[y][x] != last || last == 0 )
            {
                last = this.plateau[y][x];
                nbr = 1;
            }
            else
                nbr++;
            if (nbr == 4)
                return (this.turn);
            y += 1;
            x += way;
        }
        return (0);
    }

    isOver() {
        for (var y = 0; y < 6; y++)
        {
            var lastValX = this.plateau[y][0];
            var nbr = 0;
            for (var x = 0; x < 7; x++)
            {
                if (this.plateau[y][x] != lastValX || lastValX == 0)
                {
                    lastValX = this.plateau[y][x];
                    nbr = 1;
                }
                else
                    nbr++;
                if (nbr == 4)
                    return (this.turn);
            }
        }
        for (var x = 0; x < 7; x++)
        {
            var lastValY = this.plateau[0][x];
            var nbr = 0;
            for (var y = 0; y < 6; y++)
            { 
                if (this.plateau[y][x] != lastValY || lastValY == 0)
                {
                    lastValY = -1;
                    nbr = 1;
                }
                else
                    nbr++;
                if (nbr == 4)
                    return (this.turn);
            }
        }
        if (this.check_diag(2, 0, 1) != 0 || this.check_diag(1, 0, 1) != 0 || this.check_diag(0, 0, 1) != 0
        || this.check_diag(0, 1, 1) != 0 || this.check_diag(0, 2, 1) != 0 || this.check_diag(0, 3, 1) != 0
        || this.check_diag(2, 6, -1) != 0 || this.check_diag(1, 6, -1) != 0 || this.check_diag(0, 6, -1) != 0
        || this.check_diag(0, 5, -1) != 0 || this.check_diag(0, 4, -1) != 0 || this.check_diag(0, 3, -1) != 0)
            return (this.turn);
        return (0);
    }

    nextTurn() {
        this.turn = (this.turn == 1) ? 2 : 1;
    }
    
    print_plateau(extra, user, guildName) {
        const j1 = "\:closed_book:";
        const j2 = "\:green_book:";
        const gap = "       ";
        var grid = "° *";
        for (var i = 1; i < 7; i++)
            grid = grid + i + gap.substring(0, 6);
        grid += "7*\n"
        for (var y = 0; y < 6; y++)
        {
            for (var x = 0; x < 7; x++)
                grid += ((this.plateau[y][x] == 0) ? gap : (this.plateau[y][x] == 1) ? j1 : j2) + ((x < 6) ? "|" : "\n");
        }
        grid = grid + "°\n";
        extra.botInfos.guilds.forEach(bGuild => {
            if (bGuild.blockedCmds.find(blockedCmd => blockedCmd == "puissance4") == undefined)
            {
                let intro = ((bGuild.tag) ? `${user}` : user.username);
                bGuild.sendOnChannel(intro + " sur **" + guildName + "** à joué :\n" + grid, "games");
            }
        });
        //channel.send(grid)
    }

    next_free_space(x)
    {
        let y = 0;
        while (y < 6 && this.plateau[y][x] == 0)
            y++;
        return (((this.plateau[0][x] != 0) ? -1 : y - 1));
    }

    put_power(x, channel, extra, user) {
        x -= 1;
        let y;
        if ((x < 0 || x > 6)
        || (y = this.next_free_space(x)) < 0)
        {
            channel.send("Mauvaises coordonnées \:thinking:")
            return (-1);
        }
        this.plateau[y][x] = this.turn;
        this.free_cases -= 1;
        this.print_plateau(extra, user, channel.guild.name);
        if (this.free_cases == 0)
        {
            const bronze = extra.emojis["bronze"];
            extra.botInfos.guilds.forEach(bGuild => {
                if (bGuild.blockedCmds.find(blockedCmd => blockedCmd == "morpion") == undefined)
                    bGuild.sendOnChannel(`**Egalité** ... ${bronze}`, "games");
            });
            this.onGame = 0;
            return (this.turn);
        }
        if (this.isOver() > 0)
        {
            const top500 = extra.emojis["top500"];
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

module.exports = Power4;