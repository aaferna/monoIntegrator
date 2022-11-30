let log4js = require('log4js');


exports.log = (tipo, data) => {
    
    log4js.configure({
        appenders: { 
            integrator: { type: 'file', filename: './log/'+date.toDay()+'.log', maxLogSize: 5242880, backups: 10 },
        },
        categories: { 
          default: { 
            appenders: ['integrator'], level: 'info' ,
          }
        }
    });

    lg = log4js.getLogger('integrator');

    switch (tipo) {
        case "error":
            lg.error(data);
            break;
        case "info":
            lg.info(data);
            break;
        case "warn":
            lg.warn(data);
            break;
        case "debug":
            lg.debug(data);
            break;
    }


}

