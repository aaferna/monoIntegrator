require("dotenv").config();

global.datetoDay = require("./modules/date").datetoDay
global.dateNow = require("./modules/date").dateNow
global.datetoJSON = require("./modules/date").datetoJSON
global.log = require("./modules/log4j").log
global.port = parseInt(process.env.PORT) || 3000;
global.functions = {};
global.fs = require("fs");

const cluster = require("cluster")
const numCPUs = require('os').cpus().length;
const dirFunc = "./functions/";

  try {
      fs.readdirSync(dirFunc).forEach(filename => {
          // log("info", `Se inicializo el Paquete de Funcion ${filename.replace(".js", "")} `)
          if (filename.endsWith(".js")) {
              const functionName = filename.replace(".js", "");
              functions[functionName] = require(dirFunc+filename);
          }
      });
  } catch (error) {
      log("warn", `PID ${process.pid} :: Existe un error al importar una funcion :: ${error}`)
  }


const appserver = require("./server");


  if (cluster.isMaster) {

    if(parseInt(process.env.DDOSSTATUS)){
      log("info", `Modulo DDOSBlock Habilitado`)
    }else{
      log("info", `Modulo DDOSBlock Desactivado`)
    }

    try {
      fs.readdirSync(dirFunc).forEach(filename => {
          log("info", `Funcion ${filename.replace(".js", "")} detectada `)
      });
    } catch (error) {
        log("warn", "No existen funciones por importar")
    }

    


    log("info", `Master se inicio bajo PID ${process.pid}`)

    // Crea un trabajador por cada núcleo

      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }
    
      cluster.on('exit', (worker, code, signal) => {
        log("info", `El Proceso ${worker.process.pid} se cerro bajo el codigo ${code} y con señal ${signal}`);
        // cluster.fork();
        // log("info", `Se inicia un nuevo Worker con el PID ${worker.process.pid}`);
      });
  
  } else {
  
    // Iniciamos el servidor

      port = port + cluster.worker.id

      appserver.listen(port, () => {
        log("info", `Servidor iniciado en el puerto ${port} bajo PID ${process.pid}`)
      });


}

