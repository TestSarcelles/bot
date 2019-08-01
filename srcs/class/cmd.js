class Cmd
{
    constructor(cmd_name, cmd_description, cmd_function)
    {
        this.name = cmd_name;
        this.description = cmd_description;
        this.run = cmd_function;
    }
}

module.exports = Cmd;