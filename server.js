const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const {
	jsonErrorHandler,
	notFoundHandler,
	trx,
} = require('./modules/expressHandle');

global.MySQL = require('./modules/sql').executeSQL;
global.trx = trx;
global.router = express.Router();

app.use(express.json());

if (process.env.ENABLE_HELMET === 'true') {
	app.use(helmet());
}

if (process.env.ENABLE_CORS === 'true') {
	app.use(cors({ origin: '*' }));
}

app.use(jsonErrorHandler);

app.use(function (req, res, next) {
	res.setHeader('X-Process', process.pid);
	next();
});


app.get('/status', (req, res) => {
	res.json({ keep: 'alive' });
});

app.use(notFoundHandler);

module.exports = app;
