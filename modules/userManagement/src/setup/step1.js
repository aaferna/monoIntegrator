require('dotenv').config();

const crypto = require('crypto');
const { spawnSync } = require('child_process');
const fs = require('fs');

// Generar una clave secreta segura
const generateSecretKey = () => {
    return crypto.randomBytes(128).toString('hex');
};

const setEnvs = (arg) => {
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
}

const prismaGenerateResult = spawnSync('npx', ['prisma', 'generate', '--schema=./modules/userManagement/src/prisma/scheme.prisma'], { stdio: 'inherit' });
const prismaMigrateResult = spawnSync('npx', ['prisma', 'migrate', 'deploy', '--schema=./modules/userManagement/src/prisma/scheme.prisma'], { stdio: 'inherit' });

setEnvs('SYSTEMUSER_PASSWORDKEY');
setEnvs('SYSTEMUSER_SESSIONKEY');
setEnvs('SYSTEMUSER_TOKENKEY');

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

envVariables['ENABLE_USERMANAGEMENT'] = true;
envVariables['SYSTEMUSER_EXPIRE'] = true;
envVariables['SYSTEMUSER_EXPIRETIME'] = '7d';

// Crear un string con las variables de entorno actualizadas
const updatedEnvContent = Object.entries(envVariables)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

// Escribir las variables de entorno actualizadas en el archivo .env
fs.writeFileSync(envFilePath, updatedEnvContent, 'utf8');


