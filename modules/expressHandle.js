const { randomUUID } = require('crypto');

exports.reqInfo = (req) =>{
  return {
    id: randomUUID(),
    ip: req.headers['x-forwarded-for'],
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
