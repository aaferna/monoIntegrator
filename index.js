require("dotenv").config();

global.datetoDay = require("./modules/date").datetoDay
global.dateNow = require("./modules/date").dateNow
global.datetoJSON = require("./modules/date").datetoJSON
global.log = require("./modules/log4j").log
global.port = parseInt(process.env.PORT) || 3000;
global.functions = {};
global.fs = require("fs");
global.path = require('path');
global.dirRout = `./routes/`;

const cluster = require("cluster")
const dirFunc = "./functions/";

let numCPUs = require('os').cpus().length;

try {
  let funfiles = fs.readdirSync(dirFunc)
    if(funfiles.length == 0) {
      log("info", `No hay Funciones para inicializar `)
    }
      funfiles.forEach(filename => {
      if (filename.endsWith(".js")) {
          const functionName = filename.replace(".js", "");
          functions[functionName] = require(dirFunc+filename);
      }
  });
} catch (error) {
  log("warn", `PID ${process.pid} :: Existe un error al importar una funcion :: ${error}`)
}


  if(process.argv.slice(2)[0] === "dev"){
    
    log("info", `monoIntegrator iniciado en modo Desarrollador`)
    
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
        log("warn", `Existio un inconveniente al validar las funciones :: ${error}`)
        process.exit()
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
      if(files.length == 0) {
        log("info", `No hay Rutas para inicializar `)
      }
      files.forEach(file => {
        if (file.endsWith(".js")) {
          log("info", `Ruta ${file} detectada `)

        }
      });
    
    } catch (error) {
      log("error", `Existe un inconveniente al validar las rutas :: ${error}`);
    }

    const appserver = require("./server");
          appserver.listen(port, () => {
            log("info", `Servidor iniciado en el puerto ${port} bajo PID ${process.pid}`)
          });

  } else {

    if (cluster.isMaster) {


      log("info", `Master se inicio bajo PID ${process.pid}`)

        for (let i = 0; i < numCPUs; i++) {
          cluster.fork();
        }
      
        cluster.on('exit', (worker, code, signal) => {
          log("info", `El Proceso ${worker.process.pid} se cerro bajo el codigo ${code} y con señal ${signal}`);
          // cluster.fork();
          // log("info", `Se inicia un nuevo Worker con el PID ${worker.process.pid}`);
        });
    
    } else {
    
      port = port + cluster.worker.id
      const appserver = require("./server");
            appserver.listen(port, () => {
              log("info", `Servidor iniciado en el puerto ${port} bajo PID ${process.pid}`)
            });

    }

  }

