const   express = require('express'), 
        router = express.Router()

    router.get('/v1/manager/status', (req, res) => {

        let conn = db.sql("test", "SELECT * FROM users")
            conn.then(data =>{ 

                functions["alert"].conlog(data)

            })

        let response = { 
            date: date.toJSON(), 
            ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress, 
        }

        res.json(response) 

    })

module.exports = router;