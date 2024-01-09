const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const corsFile = require('./cors.json')
const helmetFile = require('./helmet.json')

const {
	jsonErrorHandler,
	notFoundHandler,
	trx,
} = require('./core/expressHandle');
const dirRout = './routes/';

global.trx = trx;
global.router = express.Router();


app.use(express.json());

if (process.env.ENABLE_STATMANAGEMENT === 'true') app.use(require('./core/statsManager/mdlw'));
if (process.env.ENABLE_HELMET === 'true') app.use(helmet(helmetFile));
if (process.env.ENABLE_CORS === 'true') app.use(cors(corsFile));

app.use(jsonErrorHandler);

if(process.env.PROCESS_HEADER === 'true'){
	app.use(function (req, res, next) {
		res.setHeader('X-Process', process.pid);
		next();
	});
}

try {
	const files = walkSync(dirRout);
	files.forEach(file => {
		if (file.endsWith('.js')) {
			try {
				const route = require(`./${file}`);
				if (process.env.TRACE === 'true' || process.env.NODE_ENV == 'prd') {
					log("info", `Ruta ${file} detectada`);
				}
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
