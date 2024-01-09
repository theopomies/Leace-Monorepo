import { PrismaClient } from "@prisma/client";
//import { S3Client } from "@aws-sdk/client-s3";

import {
  makeUserAttributes,
  makePosts,
  makeUsers,
  makePostAttributes,
  makeRelationships,
  makeConversations,
  makeMessages,
  makeReports,
  //makeImages,
} from "./generateData";

const prisma = new PrismaClient();
// const s3Client = new S3Client({
//   region: "eu-west-3",
//   apiVersion: "2006-03-01",
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
//   },
// });

async function main() {
  await prisma.user.createMany({
    data: makeUsers(),
  });

  await prisma.attribute.createMany({
    data: await makeUserAttributes(prisma),
  });

  await prisma.post.createMany({
    data: await makePosts(prisma),
  });

  await prisma.attribute.createMany({
    data: await makePostAttributes(prisma),
  });

  await prisma.relationship.createMany({
    data: await makeRelationships(prisma),
  });

  await prisma.conversation.createMany({
    data: await makeConversations(prisma),
  });

  await prisma.message.createMany({
    data: await makeMessages(prisma),
  });

  // await prisma.image.createMany({
  //   data: await makeImages(prisma, s3Client),
  // });

  await prisma.report.createMany({
    data: await makeReports(prisma),
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
