const express = require('express');
const cors = require('cors');
const app = express();
const helmet = require('helmet');
const {
	jsonErrorHandler,
	notFoundHandler,
	reqInfo,
} = require('./modules/expressHandle');

global.executeSQL = require('./modules/sql').executeSQL;
global.executeSQLS = require('./modules/sql').executeSQLS;
global.reqInfo = reqInfo;
global.router = express.Router();

app.use(express.json());

if (process.env.ENABLE_HELMET == 'true') app.use(helmet());
if (process.env.ENABLE_CORS == 'true') app.use(cors({ origin: '*' }));

app.use(jsonErrorHandler);

app.use(function (req, res, next) {
	res.setHeader('X-Process', process.pid);
	next();
});

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
	files.forEach(file => {
		if (file.endsWith('.js')) {
			try {
				const route = require(`./${file}`);
				app.use(route);
			} catch (error) {
				log(
					'error',
					`Existe un inconveniente al importar la ruta ubicada en ${file}: ${error}`,
				);
			}
		}
	});
} catch (error) {
	log(
		'error',
		`Existe un inconveniente al recorrer los archivos de rutas: ${error}`,
	);
}

app.get('/status', (req, res) => {
	res.json({ keep: 'alive' });
});

app.use(notFoundHandler);

module.exports = app;
