exports.jsonErrorHandler = async (err, req, res, next) => {
    const { randomUUID } = require('crypto'),
    idreq = randomUUID()
    log4j.log("warn", `IP ${req.headers['x-forwarded-for'] || req.socket.remoteAddress } :: Method ${ req.method } :: Endpoint ${req.originalUrl} :: IDREQ ${idreq} :: Se enviaron datos que no estan formateados en JSON`)
    res.status(400).json({ msg: "Existe un inconveniente en la solicitud", idreq: idreq}) 
}

