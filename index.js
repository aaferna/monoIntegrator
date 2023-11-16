require('dotenv').config();

log = require('./modules/log4j').log;
global.debug = require('./modules/log4j').debug;
global.port = parseInt(process.env.PORT) || 3000;
global.functions = {};
global.fs = require('fs');
global.path = require('path');
global.dirRout = './routes/';
global.dirFunc = './functions/';
global.codePath = __dirname;


const numCPUs = require('os').cpus().length
const cluster = require('cluster');

global.walkSync = (dir, filelist = []) => {
	fs.readdirSync(dir).forEach(file => {
		filelist = fs.statSync(path.join(dir, file)).isDirectory()
			? walkSync(path.join(dir, file), filelist)
			: filelist.concat(path.join(dir, file));
	});
	return filelist;
};

try {
	const functionFiles = walkSync('./functions/');
	functionFiles.forEach(file => {
		if (file.endsWith('.js')) {
			try {
				const functionName = file.split('/').pop().replace('.js', '');
				global.functions[functionName] = require(`./${file}`);
			} catch (error) {
				log('error', `Existe un inconveniente al importar la función ubicada en ${file}: ${error}`);
			}
		}
	});
} catch (error) {
	log('error', `Existe un inconveniente al recorrer los archivos en Funciones: ${error}`);
}

if (process.argv.slice(2)[0] === 'dev') {
	log('info', `monoIntegrator iniciado en modo Desarrollador`);

	try {
		const functionFiles = fs.readdirSync(dirFunc);
		functionFiles.forEach(filename => {
			log("info", `Funcion ${filename.replace(".js", "")} detectada `)
		});
	} catch (error) {
		log('warn', `Existió un inconveniente al validar las funciones :: ${error}`);
		process.exit();
	}

	try {
		const routeFiles = global.walkSync(global.dirRout);
		if (routeFiles.length === 0) {
			log('info', `No hay rutas para inicializar`);
		}
		routeFiles.forEach(file => {
			if (file.endsWith('.js')) {
				// log("info", `Ruta ${file} detectada `)
			}
		});
	} catch (error) {
		log('error', `Existe un inconveniente al validar las rutas :: ${error}`);
	}

	const appServer = require('./server');
	appServer.listen(global.port, () => {
		log('info', `Servidor iniciado en el puerto ${global.port} bajo PID ${process.pid}`);
	});
} else {
	if (cluster.isMaster) {
		log('info', `Master se inició bajo PID ${process.pid}`);

		for (let i = 0; i < numCPUs; i++) {
			cluster.fork();
		}

		cluster.on('exit', (worker, code, signal) => {
			log('info', `El Proceso ${worker.process.pid} se cerró bajo el código ${code} y con señal ${signal}`);
		});
	} else {
		global.port = global.port + cluster.worker.id;
		const appServer = require('./server');
		appServer.listen(global.port, () => {
			log('info', `Servidor iniciado en el puerto ${global.port} bajo PID ${process.pid}`);
		});
	}
}
