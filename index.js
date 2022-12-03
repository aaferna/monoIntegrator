const   path = require('path'), 
        os = require("os"), 
        cluster = require("cluster"),
        appserver = require("./core/server")

  if( process.argv.slice(2)[0] === "dev"){
      deployPath = path.dirname(__filename);
  } else {
      deployPath = path.dirname(process.execPath);
  }

  global.config = require(path.join(deployPath, "/config.json"));
  global.log4j  = require("./core/modules/log4j")
  global.dateT  = require("./core/modules/date")
  global.db  = require("./core/modules/sql")

  let clusterWorkerSize, port = 999

  if(config.clusterWorkerSize > os.cpus().length){
    clusterWorkerSize = os.cpus().length 
    // log4j.log('warn', `Indico ${config.clusterWorkerSize} clusterWorkerSize. Se deja ${os.cpus().length} ya que es la cantidad de CPUs que dispone` )
    // console.log(`Indico ${config.clusterWorkerSize} clusterWorkerSize. Se deja ${os.cpus().length} ya que es la cantidad de CPUs que dispone`)
  } else {
    clusterWorkerSize = config.clusterWorkerSize
  }


try {

  if (clusterWorkerSize > 1) {

    if (cluster.isMaster) {
      for (let i=0; i < clusterWorkerSize; i++) {
        cluster.fork()
      }
  
      cluster.on("exit", function(worker, code, signal) {
        console.log(`Worker ${worker.id} con PID ${worker.process.pid} se cerro de manera inesperada :: CodeExit ${code} :: Signal ${signal}`)
        log4j.log('error', `Worker ${worker.id} con PID ${worker.process.pid} se cerro de manera inesperada :: CodeExit ${code} :: Signal ${signal}`)
      })

    } else {

      port = port+cluster.worker.id

      appserver.listen(port, function () {
        console.log(`Worker ${process.pid} iniciado :: Puerto ${port}`)
      })

    }

    log4j.log('info', `${ 
      port == 999 ? 
      "Master :: PID " + process.pid : 
      "Worker :: PID " + process.pid + " :: Puerto " + port 
    }`)

  } else {

    appserver.listen(port, function () {
        console.log(`Worker ${process.pid} iniciado :: Puerto ${port}`)
    })

  }

} catch (error) {
  log4j.log('error', `Existe un error al intentar abrir el proceso ${process.pid} :: ${error} ` )
  log4j.log('error',  error)
  console.log(`Existe un error al intentar abrir el proceso ${process.pid}`, error)
}