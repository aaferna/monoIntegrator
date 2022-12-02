global.express = require("express")
global.router = express.Router()
        
const   exsrv = express(),
        helmet = require('helmet'),
        fs = require('fs'),
        cors = require('cors'),
        { jsonErrorHandler } = require("../core/modules/express")
        
    global.functions = []

    let dirFunc = require("path").join(__dirname, "../functions/"),
        funcFiles = fs.readdirSync(dirFunc);
        funcFiles.forEach(r =>{
            functions[r.replace(".js", "")] = require(dirFunc + "/" + r);
        })

    let dirApis = require("path").join(__dirname, "../components/"),
        apiFiles = fs.readdirSync(dirApis);
        apiFiles.forEach(r =>{
            exsrv.use(require(dirApis + "/" + r));
            
        })

    exsrv.use(express.json())
    exsrv.use(jsonErrorHandler)
    exsrv.use(helmet())
    exsrv.use(cors({ origin: '*' }));


    exsrv.get('/methods', (req, res) => {

        let methodstoShow = []

        function space(x) {
            var res = '';
            while(x--) res += ' ';
            return res;
        }
        
        function listRoutes(){
            for (var i = 0; i < arguments.length;  i++) {
                if(arguments[i].stack instanceof Array){
                    arguments[i].stack.forEach(function(a){
                        var route = a.route;
                        if(route){
                            route.stack.forEach(function(r){
                                var method = r.method.toUpperCase();
                                // console.log(method,space(8 - method.length),route.path);

                                methodstoShow.push({
                                    method: method,
                                    uri: route.path

                                })


                            })
                        }
                    });
                }
            }
        }
        
        listRoutes(router)

        res.status(400).json({ routes: methodstoShow }) 

    })

    exsrv.all('*', (req, res, next) => { 
        log4j.log("warn", `IP ${req.headers['x-forwarded-for'] || req.socket.remoteAddress } :: Method ${ req.method } :: Endpoint ${req.originalUrl} :: No se puede resolver el metodo `)
        res.status(404).json({
            msg: `No se puede resolver el metodo ${req.originalUrl}`
        }); 
    });

module.exports = exsrv