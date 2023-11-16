const log4js = require('log4js');

exports.log = (tipo, data, appenderName = 'Integrador') => {
	const isDevMode = process.argv.slice(2)[0] === 'dev'; // Lee la variable de entorno DEVMODE

	const appenders = {
		[appenderName]: {
			type: 'file',
			filename: `./log/integrator`,
			pattern: 'yyyy-MM-dd.log',
			alwaysIncludePattern: true,
			daysToKeep: 20, // Número de días a mantener los archivos de registro (cambiar según tus necesidades)
			maxLogSize: 15000000, // Tamaño máximo del archivo de registro
		},
	};

	// Agrega un appender adicional para mostrar registros en la consola solo si está en modo "Dev"
	if (isDevMode) appenders.consoleAppender = { type: 'console' };

	log4js.configure({
		appenders,
		categories: {
			default: {
				appenders: isDevMode
					? [appenderName, 'consoleAppender']
					: [appenderName],
				level: 'debug',
			},
		},
	});

	const logger = log4js.getLogger(appenderName);

	if (tipo == 'debug') {
		logger.debug(data);
	} else if (tipo == 'error') {
		logger.error(data);
	} else if (tipo == 'warn') {
		logger.warn(data);
	} else if (tipo == 'info') {
		logger.info(data);
	}
};

exports.debug = data => {
	this.log('debug', data);
};
