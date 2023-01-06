import { PrismaClient } from "@prisma/client";
import { makeImages, makePosts, makeReports, makeUsers } from "./generateData";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: makeUsers(),
  });

  const posts = await makePosts(prisma);
  await prisma.post.createMany({
    data: posts,
  });

  const reports = await makeReports(prisma);
  await prisma.report.createMany({
    data: reports,
  });

  const images = await makeImages(prisma);
  await prisma.image.createMany({
    data: images,
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
