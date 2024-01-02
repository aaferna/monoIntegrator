router.all("/echo", (req, res) => {
  const { id, ip, uri, method } = trx(req);

  try {

    fun['console.log'].con('hole')
    res.status(200).json({ id, ip, uri, method });

  } catch (err) {
    log("error", `Existe un inconveniente - ${id} :: ${ip} :: ${uri} :: ${method} :: ${err}`, "Manager");
    res.status(500).json({ msg: "Existe un inconveniente en la solicitud", id });
  }
});

module.exports = router;