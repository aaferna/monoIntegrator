const   express = require("express"), 
        exsrv = express(),
        helmet = require('helmet'),
        fs = require('fs'),
        cors = require('cors'),
        jsonErrorHandler = async (err, req, res, next) => {
            log4j.log("warn", `IP Origen: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress }, Endpoint: ${req.originalUrl} | Se enviaron datos que no estan formateados en JSON`)
            res.json({ msg : "Se enviaron datos que no estan formateados en JSON" });
        }

    global.functions = []

    let dirFunc = require("path").join(__dirname, "../functions/"),
        funcFiles = fs.readdirSync(dirFunc);
        funcFiles.forEach(r =>{
            functions[r.replace(".js", "")] = require(dirFunc + "/" + r);
        })

        

    exsrv.use(express.json())
    exsrv.use(helmet())
    exsrv.use(jsonErrorHandler)
    exsrv.use(cors({ origin: '*' }));


    let dirApis = require("path").join(__dirname, "../components/"),
        apiFiles = fs.readdirSync(dirApis);
        apiFiles.forEach(r =>{
            exsrv.use(require(dirApis + "/" + r));
        })



    exsrv.all('*', (req, res, next) => { 

        log4j.log("warn", `IP Origen: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress }, Endpoint: ${req.originalUrl} | No se puede resolver el metodo `)
        res.status(404).json({
            msg: `No se puede resolver el metodo ${req.originalUrl}`
        }); 

    });

module.exports = exsrv