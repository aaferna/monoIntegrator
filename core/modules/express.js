exports.jsonErrorHandler = async (err, req, res, next) => {
    log4j.log("warn", `IP Origen: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress }, Endpoint: ${req.originalUrl} | Se enviaron datos que no estan formateados en JSON`)
    res.json({ msg : "Se enviaron datos que no estan formateados en JSON" });
}

