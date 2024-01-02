require('dotenv').config();
const dirFunc = './functions/', port =  parseInt(process.env.PORT) || 1900;

global.log = require('./core/log4j').log;
global.logd = require('./core/log4j').ldebug;
global.fun = {};
global.fs = require('fs');
global.path = require('path');
global.codePath = __dirname;
global.fun =[];

if (process.argv[2] === 'dev') {
	process.env.NODE_ENV = process.argv[2]
	log('warn', `monoIntegrator iniciado en modo Desarrollador`);
} else {
	log('info', `monoIntegrator iniciado en modo Productivo`);
}

global.walkSync = (dir, filelist = []) => {
	fs.readdirSync(dir).forEach(file => {
		filelist = fs.statSync(path.join(dir, file)).isDirectory()
			? walkSync(path.join(dir, file), filelist)
			: filelist.concat(path.join(dir, file));
	});
	return filelist;
};

try {
	const files = walkSync(dirFunc);
	files.forEach(file => {
		if (file.endsWith('.js')) {
			try {
				
				const functionName = file.split('/');
				const nombreFuncion = functionName[functionName.length - 1].replace('.js', '');
				fun[nombreFuncion] = require(`./${file}`);

				if (process.env.TRACE === 'true' || process.env.NODE_ENV == 'prd') {
					log("info", `Función ${nombreFuncion} detectada`);
				}

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

const appserver = require('./server');
appserver.listen(port, () => {
	log(
		'info',
		`Servidor iniciado en el puerto ${port} bajo PID ${process.pid}`,
	);
});