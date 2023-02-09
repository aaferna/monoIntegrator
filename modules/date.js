const { DateTime } = require("luxon");

const formatearFecha = (fecha) => {
    return fecha.setZone('America/Argentina/Buenos_Aires');
};

const dateNow = () => {
    let date = formatearFecha(DateTime.local());
    return date.toLocaleString(DateTime.DATETIME_FULL);
};

const datetoDay = () => {
    let date = formatearFecha(DateTime.local());
    return date.toFormat('yyyy-MM-dd');
};

const datetoJSON = () => {
    let date = formatearFecha(DateTime.local());
    return {
        day: date.day,
        month: date.month,
        year: date.year,
        hour: date.hour,
        minute: date.minute,
        second: date.second
    };
};

module.exports = {
    datetoDay,
    dateNow,
    datetoJSON
};