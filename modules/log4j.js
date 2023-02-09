const log4js = require('log4js');

exports.log = (tipo, data, appenderName = "Integrador") => {
  
  log4js.configure({
    appenders: {
      [appenderName]: { type: 'file', filename: `./log/${datetoDay().replace(/-/g, "")}.log`, maxLogSize: 5242880, backups: 10 }
    },
    categories: {
      default: { appenders: [appenderName], level: 'debug' }
    }
  });

  const logger = log4js.getLogger(appenderName);

    if(tipo == "debug"){
      logger.debug(data);
    } else if(tipo == "error"){
      logger.error(data);
    } else if(tipo == "warn"){
      logger.warn(data);
    } else if(tipo == "info"){
      logger.info(data);
    }

};
