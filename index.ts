import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "./app/generated/prisma/client";

const prisma = new PrismaClient().$extends(withAccelerate());

async function main() {}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
