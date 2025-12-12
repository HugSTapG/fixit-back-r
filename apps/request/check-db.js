// Script directo usando require, sin TypeScript
const path = require('path');

// Cargar variables de entorno
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { PrismaClient } = require('./@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.REQUEST_DATABASE_URL,
    },
  },
});

async function main() {
  try {
    console.log('🔍 DATABASE_URL:', process.env.REQUEST_DATABASE_URL?.substring(0, 60) + '...');
    
    console.log('\n🔍 Paso 1: Total registros en solicitudes...');
    const total = await prisma.solicitud.count();
    console.log(`✅ Total: ${total}`);

    console.log('\n🔍 Paso 2: Contando por cada condición...');
    const pendientes = await prisma.solicitud.count({
      where: { estadoSolicitud: 'PENDIENTE' },
    });
    console.log(`  - PENDIENTE: ${pendientes}`);

    const sinTecnico = await prisma.solicitud.count({
      where: { idTecnicoAsignado: null },
    });
    console.log(`  - Sin tecnico: ${sinTecnico}`);

    const activos = await prisma.solicitud.count({
      where: { isActive: true },
    });
    console.log(`  - Activos: ${activos}`);

    console.log('\n🔍 Paso 3: Solicitudes con ALL 3 condiciones...');
    const disponibles = await prisma.solicitud.findMany({
      where: {
        estadoSolicitud: 'PENDIENTE',
        idTecnicoAsignado: null,
        isActive: true,
      },
      select: {
        idSolicitud: true,
        titulProblema: true,
        estadoSolicitud: true,
        idTecnicoAsignado: true,
        isActive: true,
        fechaPublicacion: true,
      },
      take: 3,
      orderBy: { fechaPublicacion: 'desc' },
    });

    console.log(`✅ Disponibles: ${disponibles.length}`);
    if (disponibles.length > 0) {
      console.log('\n📋 Primeras 3:');
      disponibles.forEach((sol, i) => {
        console.log(`  ${i + 1}. ID: ${sol.idSolicitud}, Título: ${sol.titulProblema}`);
      });
    } else {
      console.log('❌ NO hay solicitudes disponibles para técnicos');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
