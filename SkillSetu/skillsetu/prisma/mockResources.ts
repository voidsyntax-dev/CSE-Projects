const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function mockResources() {
  console.log("Adding mock difficulty and ratings to resources...");

  const resources = await prisma.resource.findMany();
  let count = 0;

  for (const res of resources) {
    const difficulty = Math.floor(Math.random() * 3) + 1; // 1 to 3
    const rating = Math.round((Math.random() * 2 + 3) * 10) / 10; // 3.0 to 5.0
    
    await prisma.resource.update({
      where: { id: res.id },
      data: {
        difficulty,
        rating
      }
    });
    count++;
  }

  console.log(`Successfully updated ${count} resources!`);
}

mockResources()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export {};
