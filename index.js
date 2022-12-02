const   path = require('path'), os = require("os"), cluster = require("cluster")
        appserver = require("./core/server")

const clusterWorkerSize = os.cpus().length
       
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

        // appserver.listen(config.port, () => {

        //     console.log(`monoIntegrator se inicializo`)
        
        // }).on('error', function (err) {
        
        //     if(err.errno === -4091) {
        //         console.log(`----- El puerto ${config.port} esta ocupado, que tal si usa ${parseInt(config.port) + 1} -----`);
        //         log4j.log('info' , `El puerto ${config.port} esta ocupado, que tal si usa ${parseInt(config.port) + 1}`)
        //     } else { 
        //         log4j.log('error' , err)
        //     }
            
        // });



try {
  if (clusterWorkerSize > 1) {

    if (cluster.isMaster) {
      for (let i=0; i < clusterWorkerSize; i++) {
        cluster.fork()
      }
  
      cluster.on("exit", function(worker) {
        console.log(`Worker iniciado :: ${worker.id} se cerro de manera inesperada`)
        log4j.log('error' , `Worker iniciado :: ${worker.id} se cerro de manera inesperada`)
      })
  
    } else {
  
      appserver.listen(config.port, function () {
        console.log(`Worker iniciado :: ${process.pid} `)
      })
  
    }
  
    log4j.log('info' , `Worker iniciado :: ${process.pid} `)
  
  } else {
  
      appserver.listen(config.port, function () {
          console.log(`Worker iniciado :: ${process.pid} `)
      })
  
      log4j.log('info' , `Worker iniciado :: ${process.pid} `)
  
  }
} catch (error) {
  log4j.log('error', `Existe un error al intentar abrir el proceso ${process.pid} :: ${error} ` )
  log4j.log('error',  error)
  console.log(`Existe un error al intentar abrir el proceso ${process.pid}`)
}