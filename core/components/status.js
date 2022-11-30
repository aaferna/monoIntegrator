const   express = require('express'), 
        router = express.Router()

    router.get('/v1/manager/status', (req, res) => {

        let response = { 
            date: date.toJSON(), 
            ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress, 
        }

        functions["alert"].conlog(response)
        
        res.json(response) 

    })

module.exports = router;