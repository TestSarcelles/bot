class BotDate
{
    constructor(date)
    {
        if (date != undefined)
        {
            this.day = parseInt(date.split(" ")[0].split("/")[0], 10);
            this.month =  parseInt(date.split(" ")[0].split("/")[1], 10);
            this.year =  parseInt(date.split(" ")[0].split("/")[2], 10);
            this.hour =  parseInt(date.split(" ")[1].split("h")[0], 10);
            this.minute =  parseInt(date.split(" ")[1].split("h")[1], 10);
            if (isNaN(this.minute))
                this.minute = 0;
            this.isValid();
        }   
    }

    isValid()
    {
        this.valid = true;
        if (isNaN(this.month) || this.month < 1 || this.month > 12)
            this.valid = false;
        if (isNaN(this.day) || this.day < 1 || this.day > 31)
            this.valid = false;
        if (isNaN(this.hour) || this.hour < 0 || this.hour > 24)
            this.valid = false;
        if (isNaN(this.minute) || this.minute < 0 || this.minute > 60)
            this.valid = false;
    }

    isAfter(date)
    {
        if (this.year != date.year)
            return ((this.year > date.year) ? true : false);
        if (this.month != date.month)
            return ((this.month > date.month) ? true : false);
        if (this.day != date.day)
            return ((this.day > date.day) ? true : false);
        if (this.hour != date.hour)
            return ((this.hour > date.hour) ? true : false);
        if (this.minute != date.minute)
            return ((this.minute > date.minute) ? true : false);
        return (false);
    }

    isBefore(date)
    {
        if (this.year != date.year)
            return ((this.year < date.year) ? true : false);
        if (this.month != date.month)
            return ((this.month < date.month) ? true : false);
        if (this.day != date.day)
            return ((this.day < date.day) ? true : false);
        if (this.hour != date.hour)
            return ((this.hour < date.hour) ? true : false);
        if (this.minute != date.minute)
            return ((this.minute < date.minute) ? true : false);
        return (false);
    }

    isEqual(date)
    {
        if (this.year == date.year && this.month == date.month && this.day == date.day && this.hour == date.hour && this.minute == date.minute)
            return (true);
        return (false);
    }

    diff(date)
    {
        let diff = (this.year - date.year) * 525600;
        diff += (this.month - date.month) * 43800;
        diff += (this.day - date.day) * 1440;
        diff += (this.hour - date.hour) * 60;
        diff += this.minute - date.minute;
        return (diff * -1);
    }

    fromHTTP(date)
    {
        let offset = parseInt(date.split(',')[1].split("\":\"+")[1].split(':')[0]);
        let fullTime = date.split(',')[2].split("\":\"")[1];

        let fullDate = fullTime.split('T')[0];
        let fullHour = fullTime.split('T')[1].split(".")[0];
    
        this.year = parseInt(fullDate.split('-')[0]);
        this.month = parseInt(fullDate.split('-')[1]);
        this.day = parseInt(fullDate.split('-')[2]);
        this.hour = (parseInt(fullHour.split(":")[0]) + offset) % 24;
        this.minute = parseInt(fullHour.split(":")[1]);
        if (this.hour <= 1)
            this.day += 1;
        return (new BotDate(this.getDate() + " " + this.getHour()));
    }

    fromDate(date)
    {
        this.year = parseInt(date.split(" ")[3], 10);
        this.month = date.split(" ")[1];
        this.month = (this.month == "Jan") ? 1 : this.month;
        this.month = (this.month == "Feb") ? 2 : this.month;
        this.month = (this.month == "Mar") ? 3 : this.month;
        this.month = (this.month == "Apr") ? 4 : this.month;
        this.month = (this.month == "May") ? 5 : this.month;
        this.month = (this.month == "Jun") ? 6 : this.month;
        this.month = (this.month == "Jul") ? 7 : this.month;
        this.month = (this.month == "Aug") ? 8 : this.month;
        this.month = (this.month == "Sep") ? 9 : this.month;
        this.month = (this.month == "Oct") ? 10 : this.month;
        this.month = (this.month == "Nov") ? 11 : this.month;
        this.month = (this.month == "Dec") ? 12 : this.month;
        this.day = parseInt(date.split(" ")[2], 10);
        this.hour = parseInt(date.split(" ")[4].split(":")[0], 10);
        this.minute = parseInt(date.split(" ")[4].split(":")[1], 10);
        this.valid = true;
        return (new BotDate(this.getDate() + " " + this.getHour()));
    }

    getDate()
    {
        let string = ((this.day < 10) ? "0" : "") + this.day + "/" + ((this.month < 10) ? "0" : "") + this.month + "/" + this.year;
        return (string);
    }

    getHour()
    {
        let string = ((this.hour < 10) ? "0" : "") + this.hour + "h" + ((this.minute < 10) ? "0" : "") + this.minute;
        return (string);
    }

    toString()
    {
        let string = "le " + this.getDate() + " à " + this.getHour();
        return (string);
    }
}

module.exports = BotDate;