const express = require("express");
const cors = require('cors')
const app = express();
const helmet = require('helmet')
const { jsonErrorHandler, notFoundHandler, DDOSBlock } = require("./modules/expressHandle");

global.executeSQL = require("./modules/sql").executeSQL
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
            if (file.endsWith(".js")) {
                const route = require(`./${file}`);
                app.use(route);
            }
        });
  
} catch (error) {
    log("error", `Existe un inconveniente al importar un paquete de rutas :: ${error}`);
}
    
app.get('/status', (req, res) => {
    res.json({ "keep" : "alive" }) 
})

app.use(notFoundHandler)

module.exports = app