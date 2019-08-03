class Extra
{
    constructor()
    {
        this.ranks_name = null;
        this.ranks_role = null;
        this.morpion = null;
        this.power4 = null;
        this.commands = null;
        this.event_center = null;
        this.botInfos = null;
        this.greetHelp = null
        this.bot = null;
        this.guild_center = null;
        this.cv_center = null;
        this.team_center = null;
        this.ranks = [
            { emoji: "bronze", names: ["Bronze"]},
            { emoji: "silver", names: ["Silver", "Argent"]},
            { emoji: "gold", names: ["Gold", "Or"]},
            { emoji: "platinum", names: ["Platinum", "Platine"]},
            { emoji: "diamond", names: ["Diamond", "Diamant"]},
            { emoji: "master", names: ["Master", "Maître"]},
            { emoji: "grandmaster", names: ["Grand Master", "Grand Maître"]},
            { emoji: "top500", names: ["Top 500"]}
        ];
        this.emojis = {
            "bronze" : "603238461738319872",
            "silver" : "603238461570416653",
            "gold" : "603238461180215296",
            "platinum" : "603238461171826698",
            "diamond" : "603238462338105354",
            "master" : "603238461079814154",
            "grandmaster" : "603238462577049615",
            "top500" : "603238603602264085",
            "overWL" : "604046462434803748",
            "pile_coin" : "604294286216921089",
            "face_coin" : "604294286355202058"
        };
    }
}

module.exports = Extra;