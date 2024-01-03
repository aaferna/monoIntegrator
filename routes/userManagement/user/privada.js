router.get("/privada", fun['userManagement'].authenticateSession, (req, res) => {

    const { id, ip, uri, method } = trx(req);

    try {

      res.status(200).json({ id, ip, uri, method, user: req.user });

    } catch (err) {
      log("error", `Existe un inconveniente - ${id} :: ${ip} :: ${uri} :: ${method} :: ${err}`, "userManagement");
      res.status(500).json({ msg: "Existe un inconveniente en la solicitud", id });
    }

});

module.exports = router;