const { encode, decode } = require('jwt-simple');

exports.encodeJWT = (data, key) => {
	try {
		return { status: 1, jwt: encode(data, key) };
	} catch (err) {
		log(
			'error',
			`PID ${process.pid} :: Existe un error al encriptar ${err}`,
			'JWT',
		);
		return { status: 0 };
	}
};

exports.decodeJWT = (data, key) => {
	try {
		return { status: 1, jwt: decode(data, key) };
	} catch (err) {
		log(
			'error',
			`PID ${process.pid} :: Existe un error al desencriptar ${err}`,
			'JWT',
		);
		return { status: 0 };
	}
};

// * Con este metodo encriptamos la clave, hay que recordar guardar en la db junto con la clave, la llave para abrirla
// * console.log(this.indexEncode("78914ac35b", "@HDsob8*3f0I7Tcw^erH2oUsGH27pvwztY&L38Ou3&^#F1HN5!"))
