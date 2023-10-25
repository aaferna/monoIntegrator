require('dotenv').config();
global.datetoDay = require('./modules/date').datetoDay;
global.dateNow = require('./modules/date').dateNow;
global.dateDB = require('./modules/date').dateDB;
global.formatDate = require('./modules/date').formatDate;
global.firstLastday = require('./modules/date').firstLastday;
global.log = require('./modules/log4j').log;
global.debug = require('./modules/log4j').debug;
global.port = parseInt(process.env.PORT) || 3000;
global.functions = {};
global.fs = require('fs');
global.path = require('path');
global.dirRout = `./routes/`;
global.codePath = __dirname;

const dirFunc = './functions/',
	numCPUs = require('os').cpus().length,
	cluster = require('cluster');

try {
	const walkSync = (dir, filelist = []) => {
		fs.readdirSync(dir).forEach(file => {
			filelist = fs.statSync(path.join(dir, file)).isDirectory()
				? walkSync(path.join(dir, file), filelist)
				: filelist.concat(path.join(dir, file));
		});

		return filelist;
	};

	const files = walkSync(dirFunc);
	files.forEach(file => {
		if (file.endsWith('.js')) {
			try {
				const functionName = file.split('/');
				const nombreFuncion = functionName[functionName.length - 1].replace(
					'.js',
					'',
				);
				functions[nombreFuncion] = require(`./${file}`);
			} catch (error) {
				log(
					'error',
					`Existe un inconveniente al importar la funcion ubicada en ${file}: ${error}`,
				);
			}
		}
	});
} catch (error) {
	log(
		'error',
		`Existe un inconveniente al recorrer los archivos en Funciones: ${error}`,
	);
}

if (process.argv.slice(2)[0] === 'dev') {
	log('info', `monoIntegrator iniciado en modo Desarrollador`);

	try {
		fs.readdirSync(dirFunc).forEach(filename => {
			// log("info", `Funcion ${filename.replace(".js", "")} detectada `)
		});
	} catch (error) {
		log(
			'warn',
			`Existio un inconveniente al validar las funciones :: ${error}`,
		);
		process.exit();
	}

	try {
		const walkSync = (dir, filelist = []) => {
			fs.readdirSync(dir).forEach(file => {
				filelist = fs.statSync(path.join(dir, file)).isDirectory()
					? walkSync(path.join(dir, file), filelist)
					: filelist.concat(path.join(dir, file));
			});
			return filelist;
		};

		const files = walkSync(dirRout);
		if (files.length == 0) {
			log('info', `No hay Rutas para inicializar `);
		}
		files.forEach(file => {
			if (file.endsWith('.js')) {
				// log("info", `Ruta ${file} detectada `)
			}
		});
	} catch (error) {
		log('error', `Existe un inconveniente al validar las rutas :: ${error}`);
	}

	const appserver = require('./server');
	appserver.listen(port, () => {
		log(
			'info',
			`Servidor iniciado en el puerto ${port} bajo PID ${process.pid}`,
		);
	});
} else {
	if (cluster.isMaster) {
		log('info', `Master se inicio bajo PID ${process.pid}`);

		for (let i = 0; i < numCPUs; i++) {
			cluster.fork();
		}

		cluster.on('exit', (worker, code, signal) => {
			log(
				'info',
				`El Proceso ${worker.process.pid} se cerro bajo el codigo ${code} y con señal ${signal}`,
			);
		});
	} else {
		port = port + cluster.worker.id;
		const appserver = require('./server');
		appserver.listen(port, () => {
			log(
				'info',
				`Servidor iniciado en el puerto ${port} bajo PID ${process.pid}`,
			);
		});
	}
}
