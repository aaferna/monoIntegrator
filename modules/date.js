const { DateTime } = require('luxon');

const formatearFecha = (
	fecha,
	zonaHoraria = 'America/Argentina/Buenos_Aires',
) => {
	return fecha.setZone(zonaHoraria);
};

const dateDB = (zonaHoraria = process.env.TIMEZONE) => {
	let date = DateTime.utc().setZone(zonaHoraria);
	return date.toFormat('yyyy-MM-dd HH:mm:ss');
};

const firstLastday = (zonaHoraria = process.env.TIMEZONE) => {
	const ahora = DateTime.now().setZone(zonaHoraria);
	const primerDiaDelMes = ahora.startOf('month').toFormat('yyyy-MM-dd');
	const ultimoDiaDelMes = ahora.endOf('month').toFormat('yyyy-MM-dd');
	return { primerDia: primerDiaDelMes, ultimoDia: ultimoDiaDelMes };
};

// No se usa, Borrar?

const dateNow = (zonaHoraria = process.env.TIMEZONE) => {
	let date = formatearFecha(DateTime.local(), zonaHoraria);
	return date.toLocaleString(DateTime.DATETIME_FULL);
};

const datetoDay = (zonaHoraria = process.env.TIMEZONE) => {
	let date;
	if (zonaHoraria == 'UTC') {
		date = DateTime.utc();
	} else {
		date = formatearFecha(DateTime.local(), zonaHoraria);
	}

	return date.toFormat('yyyy-MM-dd');
};

const formatDate = fechaHoraUTC => {
	const fecha = DateTime.fromISO(fechaHoraUTC).toFormat('ddMMyy');
	return fecha;
};

module.exports = {
	datetoDay,
	dateNow,
	dateDB,
	formatDate,
	firstLastday,
};
