const express = require("express");
const cors = require('cors')
const app = express();
const helmet = require('helmet')
const { jsonErrorHandler, notFoundHandler, DDOSBlock } = require("./modules/expressHandle");
const dirRout = `./routes/`;
global.executeSQL = require("./modules/sql").executeSQL

// global.executeMultipleQueriesAsync = require("./modules/sql").executeMultipleQueriesAsync
// global.executeMultipleQuerie = require("./modules/sql").executeMultipleQuerie
global.router = express.Router()

app.use(express.json())
app.use(jsonErrorHandler)
app.use(helmet())
app.use(cors({ origin: '*' }));
app.use(function(req, res, next) {
    res.setHeader('x-process-response', process.pid)
    next();
});

if(parseInt(process.env.DDOSSTATUS)){
    app.use(DDOSBlock);
}

    try {

        fs.readdirSync(dirRout).forEach(file => {
            if (file.endsWith(".js")) {
                const route = require(`${dirRout}/${file}`);
                app.use(route);
            }
        });

    } catch (error) {
        log("error", `Existe un inconveniente al importar un paquete de rutas :: ${error}`)
    }
    

app.use(notFoundHandler)

module.exports = app