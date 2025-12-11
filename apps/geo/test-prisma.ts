import { PrismaClient } from './src/prismaClientGeo/generated';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.GEO_DATABASE_URL,
    },
  },
});

async function main() {
  try {
    console.log('Testing Prisma connection to geo_service...');
    console.log('DATABASE_URL:', process.env.GEO_DATABASE_URL);
    
    const provinciaCount = await prisma.provincia.count();
    console.log(`✓ Provincias count: ${provinciaCount}`);
    
    const cantonCount = await prisma.canton.count();
    console.log(`✓ Cantones count: ${cantonCount}`);
    
    const parroquiaCount = await prisma.parroquia.count();
    console.log(`✓ Parroquias count: ${parroquiaCount}`);
    
    if (parroquiaCount > 0) {
      const parroquias = await prisma.parroquia.findMany({
        take: 5,
        include: {
          canton: true,
        },
      });
      console.log('\n✓ Sample parroquias:');
      console.log(JSON.stringify(parroquias, null, 2));
    } else {
      console.log('\n✗ No parroquias found in database!');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
