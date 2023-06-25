const echo = (req, res) => {
    const { id, ip, uri, method } = reqInfo(req);
  
    try {

      res.status(200).json({ id, ip, uri, method });

     
    } catch (err) {
      log("error", `Existe un inconveniente - ${ id } :: ${ ip } :: ${ uri } :: ${ method } :: ${ err }`, "Manager");
      res.status(500).json({ msg: "Existe un inconveniente en la solicitud", id });
    }
  };

router.all("/echo", echo);

module.exports = router;
