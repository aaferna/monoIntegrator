const { randomUUID } = require('crypto');
const requestLog = [];
const blockedIPs = [];

exports.jsonErrorHandler = async (err, req, res, next) => {
    
  const idreq = randomUUID();
  const userIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const method = req.method;
  const endpoint = req.originalUrl;

  log("warn", `IDREQ: ${idreq} :: IP: ${userIP} :: Method: ${method} :: Endpoint: ${endpoint} :: Se enviaron datos que no estan formateados en JSON`, "DDOS");

  res.status(400).json({
    msg: "Existe un inconveniente en la solicitud",
    idreq: idreq
  });
};

exports.notFoundHandler = (req, res, next) => {
  const idreq = randomUUID();
  const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const method = req.method;
  const endpoint = req.originalUrl;

  log("warn", `IDREQ: ${idreq} :: IP: ${userIP} :: Method: ${method} :: Endpoint: ${endpoint} :: URL no encontrada`, "DDOS");

  res.status(404).json({ msg: 'Ruta no encontrada', 
    idreq: idreq
  });
};

exports.DDOSBlock = (req, res, next) => {

  const idreq = randomUUID();
  // Obtener la dirección IP del usuario
  const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const method = req.method;
  const endpoint = req.originalUrl;

  // Verificar si la IP está bloqueada
  if (blockedIPs.includes(userIP)) {

    log("warn", `IDREQ: ${idreq} :: IP: ${userIP} :: Method: ${method} :: Endpoint: ${endpoint} :: IP reintento pero se encuentra Bloqueada`, "DDOS");

      return res.status(429).json({
          msg: "Su IP se encuentra bloqueada temporalmente por reintento",
          idreq: idreq
      });
  }

  // Almacenar la solicitud en el registro de solicitudes
  requestLog.push({
    userIP: userIP,
    time: new Date()
  });

  // Contar las solicitudes repetidas de la IP
  let repeatRequestCount = 0;
  requestLog.forEach((request) => {
    if (request.userIP === userIP && (new Date() - request.time) < 1000) {
      repeatRequestCount++;
    }
  });

  // Si la IP ha realizado más de 10 solicitudes repetidas, bloquearla
  if (repeatRequestCount >= parseInt(process.env.DDOSINTENTOS)) {

      log("warn", `IDREQ: ${idreq} :: IP: ${userIP} :: Method: ${method} :: Endpoint: ${endpoint} :: IP Bloqueada`, "DDOS");
      blockedIPs.push(userIP);
      return res.status(429).json({
          msg: "Su IP se encuentra bloqueada temporalmente por reintento",
          idreq: idreq

      });
  }

  next();
}


// Verificar periódicamente si es necesario desbloquear una IP
  setInterval(() => {
    const currentTime = new Date();
  
    // Recorrer la lista de IPs bloqueadas
    blockedIPs.forEach((ip, index) => {
      // Verificar si la IP ha sido bloqueada hace más de 12 horas
      const timeDifference = currentTime - requestLog.find(r => r.userIP === ip).time;
      if (timeDifference >= 12 * 60 * 60 * 1000) {
        // if (timeDifference >= 12 * 60 * 60 * 1000) {
        // Eliminar la IP de la lista de IPs bloqueadas
        blockedIPs.splice(index, 1);
      }
    });
  }, 60 * 60 * 1000); // Verificar cada hora