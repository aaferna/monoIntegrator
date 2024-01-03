const fs = require('fs');
const crypto = require('crypto');

// Generar una clave secreta segura
const generateSecretKey = () => {
  return crypto.randomBytes(64).toString('hex');
};

// Obtener el argumento pasado al script (SYSTEMUSER_SESSIONKEY o SYSTEMTOKEN_KEY)
const arg = process.argv[2];
if (!arg) {
  console.error('Debes proporcionar un argumento tales como: SYSTEMUSER_PASSWORDKEY, SYSTEMUSER_SESSIONKEY o SYSTEMUSER_TOKENKEY .\nTambien puedes indicar uno que no exista para declararle una Key. ');
  process.exit(1);
}

// Ruta al archivo .env
const envFilePath = '.env';

// Leer el contenido actual del archivo .env
const envContent = fs.readFileSync(envFilePath, 'utf8');

// Separar las líneas del archivo .env en un arreglo
const envLines = envContent.split('\n');

// Crear un objeto para almacenar las variables de entorno
const envVariables = {};

// Analizar las líneas del archivo .env y almacenar las variables de entorno existentes
for (const line of envLines) {
  const [key, value] = line.split('=');
  if (key && value) {
    envVariables[key] = value;
  }
}

// Generar una nueva clave secreta
const secretKey = generateSecretKey();

envVariables[arg] = secretKey;

// Crear un string con las variables de entorno actualizadas
const updatedEnvContent = Object.entries(envVariables)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n');

// Escribir las variables de entorno actualizadas en el archivo .env
fs.writeFileSync(envFilePath, updatedEnvContent, 'utf8');

console.log(`${arg} actualizado: ${secretKey}`);
console.log('El archivo .env ha sido actualizado.');
