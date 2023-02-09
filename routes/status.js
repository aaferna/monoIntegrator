
router.get('/status', (req, res) => {

    executeSQL("manager", "SELECT * FROM clientes;")
    .then(e=>{
        console.log(e)
    })

    res.json({ 
        "test":"Hello World"
    }) 
})

module.exports = router;