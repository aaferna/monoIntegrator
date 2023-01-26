    router.get('/status', (req, res) => {


        // * Ejemplo de Conx. a MySQL

        // let conn = db.sql("test", "SELECT * FROM users")
        //     conn.then(data =>{ 
        //         functions["alert"].conlog(data)
        //     })

        let response = { 
            date: date.toJSON(), 
            ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress, 
        }

        res.json(response) 

    })

module.exports = router;