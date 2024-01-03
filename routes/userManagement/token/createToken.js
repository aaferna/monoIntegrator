const { randomUUID } = require('crypto');

router.post("/management/token/create", fun['userManagement'].authenticateSession, async (req, res) => {
  const { id, ip, uri, method } = trx(req);
  const { userid } = req.body; // Obtener el userid del cuerpo de la solicitud
  const userToUse = userid || req.user.userid; // Usar el userid del cuerpo o del req.user

  try {
    const client = modules['userManagement'].Client();

    const nuevoToken = await client.token.create({
      data: {
        userid: userToUse, // Usar el userid del cuerpo o del req.user
        bearer: randomUUID(),
      },
    });

    res.status(200).json(nuevoToken);
  } catch (err) {
    log("error", `Existe un inconveniente - ${id} :: ${ip} :: ${uri} :: ${method} :: ${err}`, "userManagement");
    res.status(500).json({ msg: "Existe un inconveniente en la solicitud", id });
  }
});

module.exports = router;
