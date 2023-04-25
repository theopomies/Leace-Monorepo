import { PrismaClient } from "@prisma/client";
import {
  makeImages,
  makePosts,
  makeRelationships,
  makeReports,
  makeUsers,
} from "./generateData";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: makeUsers(),
  });

  const posts = await makePosts(prisma);

  const reports = await makeReports(prisma);
  await prisma.report.createMany({
    data: reports,
  });

  const images = await makeImages(prisma);
  await prisma.image.createMany({
    data: images,
  });

  const relationships = await makeRelationships(prisma);
  await prisma.relationship.createMany({
    data: relationships,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
