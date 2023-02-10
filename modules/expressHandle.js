const { randomUUID } = require('crypto');
const requestLog = [];
const blockedIPs = [];

exports.reqInfo = (req) =>{
  return {
    id: randomUUID(),
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    uri: req.originalUrl,
    method: req.method
  }
}

exports.jsonErrorHandler = async (err, req, res, next) => {

  const { id, ip, uri, method } = this.reqInfo(req)

  log("error", `Se enviaron datos que no estan formateados en JSON - ${ id } :: ${ ip } :: ${ uri } :: ${ method } :: ${ err }`, "DDOS")

  res.status(400).json({
    msg: "Existe un inconveniente en la solicitud",
    id: id
  });
};

exports.notFoundHandler = (req, res, next) => {

  const { id, ip, uri, method } = this.reqInfo(req)

  log("warn", `URL no encontrada - ${ id } :: ${ ip } :: ${ uri } :: ${ method } `, "DDOS")

  res.status(404).json({ msg: 'Ruta no encontrada', 
    id: id
  });

};

exports.DDOSBlock = (req, res, next) => {

  const { id, ip, uri, method } = this.reqInfo(req)

  // log("warn", `URL no encontrada - ${ id } :: ${ ip } :: ${ uri } :: ${ method } `, "DDOS")

  // Verificar si la IP está bloqueada
  if (blockedIPs.includes(ip)) {

    log("warn", `IP reintento pero se encuentra Bloqueada - ${ id } :: ${ ip } :: ${ uri } :: ${ method } `, "DDOS")

      return res.status(429).json({
          msg: "Su IP se encuentra bloqueada temporalmente por reintento",
          id: id
      });
  }

  // Almacenar la solicitud en el registro de solicitudes
  requestLog.push({
    userIP: ip,
    time: new Date()
  });

  // Contar las solicitudes repetidas de la IP
  let repeatRequestCount = 0;
  requestLog.forEach((request) => {
    if (request.userIP === ip && (new Date() - request.time) < parseInt(process.env.DDOSTIMOUT)) {
      repeatRequestCount++;
    }
  });

  // Si la IP ha realizado más de 10 solicitudes repetidas, bloquearla
  if (repeatRequestCount >= parseInt(process.env.DDOSINTENTOS)) {

      log("warn", `IP Bloqueada - ${ id } :: ${ ip } :: ${ uri } :: ${ method } `, "DDOS")

      blockedIPs.push(ip);
      return res.status(429).json({
          msg: "Su IP se encuentra bloqueada temporalmente por reintento",
          id: id

      });
  }

  next();
}




  setInterval(() => {
    const currentTime = new Date();
    blockedIPs.forEach((ip, index) => {
      const timeDifference = currentTime - requestLog.find(r => r.userIP === ip).time;
      if (timeDifference >= 12 * 60 * 60 * 1000) {
        blockedIPs.splice(index, 1);
      }
    });
  }, 60 * 60 * 1000); 