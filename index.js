const   path = require('path'),
        appserver = require("./core/server")
       
        global.log4j  = require("./core/modules/log4j")
        global.date  = require("./core/modules/date")
        global.db  = require("./core/modules/sql")

        if( process.argv.slice(2)[0] === "dev"){

            deployPath = path.dirname(__filename);
            global.config = require(path.join(deployPath, "/config.json"));

        } else {
            
            deployPath = path.dirname(process.execPath);
            global.config = require(path.join(deployPath, "/config.json"));

        }

        appserver.listen(config.port, () => {

            console.log(`monoIntegrator se inicializo en el puerto ${config.port}`)
        
        }).on('error', function (err) {
        
            if(err.errno === -4091) {
                console.log(`----- El puerto ${config.port} esta ocupado, que tal si usa ${parseInt(config.port) + 1} -----`);
                log4j.log('info' , `El puerto ${config.port} esta ocupado, que tal si usa ${parseInt(config.port) + 1}`)
            } else { 
                log4j.log('error' , err)
            }
            
        });