require('dotenv').config();

const crypto = require('crypto');
const { spawnSync } = require('child_process');

const prismaGenerateResult = spawnSync('npx', ['prisma', 'generate', '--schema=./core/statsManager/src/prisma/scheme.prisma'], { stdio: 'inherit' });
const prismaMigrateResult = spawnSync('npx', ['prisma', 'migrate', 'deploy', '--schema=./core/statsManager/src/prisma/scheme.prisma'], { stdio: 'inherit' });

