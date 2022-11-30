const { DateTime } = require("luxon");

exports.dataNow = () => {
    let date = DateTime.local().setZone('America/Argentina/Buenos_Aires');
    return date.c.year+'-'+date.c.month+'-'+date.c.day+' '+date.toLocaleString(DateTime.TIME_24_WITH_SECONDS);
}

exports.toDay = () => {
    let date = DateTime.local().setZone('America/Argentina/Buenos_Aires');
    return date.c.year+'-'+date.c.month+'-'+date.c.day;
}

exports.toJSON = () => {
    let date = DateTime.local().setZone('America/Argentina/Buenos_Aires');
    return {
        day: date.c.day,
        month: date.c.month,
        year: date.c.year,
        hour: date.c.hour,
        minute: date.c.minute,
        second: date.c.second
    }
}