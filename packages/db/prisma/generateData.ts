import {
  UserStatus,
  Role,
  ReportReason,
  PrismaClient,
  Prisma,
  PostType,
  HomeType,
} from "@prisma/client";

const nbUsers = 0;
const nbPosts = 10;
const nbReports = 10;
const nbImages = 20;
const nbRelationships = 10;

export const makeUsers = () => {
  const users = new Array<Prisma.UserCreateManyInput>();

  for (let i = 0; i < nbUsers; i++) {
    users.push({
      firstName: "firstName-" + Math.random().toString(36).substring(2, 7),
      lastName: "lastName-" + Math.random().toString(36).substring(2, 7),
      email: Math.random().toString(36).substring(2, 7) + "@prisma.io",
      phoneNumber: "+336" + Math.floor(10000000 + Math.random() * 90000000),
      country: "France",
      description: "description-" + Math.random().toString(36).substring(2, 7),
      birthDate: new Date("01-01-2000"),
      status: Boolean(Math.round(Math.random()))
        ? UserStatus.ACTIVE
        : UserStatus.INACTIVE,
      isPremium: Boolean(Math.round(Math.random())) ? true : false,
      role: Boolean(Math.round(Math.random())) ? Role.TENANT : Role.OWNER,
    });
  }
  return users;
};

export const makePosts = async (prisma: PrismaClient) => {
  const newUser = await prisma.user.upsert({
    where: { email: "bob.dylan@prisma.com" },
    update: {},
    create: {
      email: "bob.dylan@prisma.com",
      firstName: "Bob",
      lastName: "Dylan",
      role: Role.TENANT,
    },
  });

  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  for (let i = 0; i < 50; i++) {
    const post = await prisma.post.upsert({
      where: { id: i.toString() },
      update: {},
      create: {
        title: `Post ${getRandomInt(1, 100)}`,
        content: `This is post number ${getRandomInt(1, 100)}.`,
        desc: `This is a description of post number ${getRandomInt(1, 100)}.`,
        type: PostType.TO_BE_RENTED,
        createdBy: {
          connect: {
            id: newUser.id,
          },
        },
        attribute: {
          create: {
            location: [
              "New York City",
              "Los Angeles",
              "Chicago",
              "Houston",
              "Phoenix",
            ][getRandomInt(0, 4)],
            lat: [40.7128, 34.0522, 41.8781, 29.7604, 33.4484][
              getRandomInt(0, 4)
            ],
            lng: [-74.006, -118.2437, -87.6298, -95.3698, -112.074][
              getRandomInt(0, 4)
            ],
            price: getRandomInt(1000, 5000),
            size: getRandomInt(100, 500),
            furnished: [true, false][getRandomInt(0, 1)],
            homeType: [HomeType.HOUSE, HomeType.APARTMENT][getRandomInt(0, 1)],
            terrace: [true, false][getRandomInt(0, 1)],
            pets: [true, false][getRandomInt(0, 1)],
            smoker: [true, false][getRandomInt(0, 1)],
            disability: [true, false][getRandomInt(0, 1)],
            garden: [true, false][getRandomInt(0, 1)],
            parking: [true, false][getRandomInt(0, 1)],
            elevator: [true, false][getRandomInt(0, 1)],
            pool: [true, false][getRandomInt(0, 1)],
          },
        },
      },
    });
  }
};

export const makeReports = async (prisma: PrismaClient) => {
  const reports = new Array<Prisma.ReportCreateManyInput>();

  for (let i = 0; i < nbReports; i++) {
    const userCount = await prisma.user.count();
    const skip = Math.floor(Math.random() * userCount);
    const createdBy = await prisma.user.findMany({
      take: 1,
      skip: skip,
      orderBy: {
        createdAt: "desc",
      },
    });
    const ownerCount = await prisma.user.count({
      where: { role: Role.TENANT },
    });
    const skipUsers = Math.floor(Math.random() * ownerCount);
    const randUser = await prisma.user.findMany({
      where: { role: Role.TENANT },
      take: 1,
      skip: skipUsers,
      orderBy: {
        createdAt: "desc",
      },
    });
    const postCount = await prisma.post.count();
    const skipPosts = Math.floor(Math.random() * postCount);
    const randPost = await prisma.post.findMany({
      take: 1,
      skip: skipPosts,
      orderBy: {
        createdAt: "desc",
      },
    });
    if (
      !createdBy ||
      !createdBy[0] ||
      !createdBy[0].id ||
      !randUser ||
      !randUser[0] ||
      !randUser[0].id ||
      !randPost ||
      !randPost[0] ||
      !randPost[0].id
    ) {
      continue;
    }
    Boolean(Math.round(Math.random()))
      ? reports.push({
          userId: randUser[0].id,
          createdById: createdBy[0].id,
          reason: Boolean(Math.round(Math.random()))
            ? ReportReason.OTHER
            : ReportReason.SCAM,
          desc: "desc-" + Math.random().toString(36).substring(2, 7),
        })
      : reports.push({
          postId: randPost[0].id,
          createdById: createdBy[0].id,
          reason: Boolean(Math.round(Math.random()))
            ? ReportReason.OTHER
            : ReportReason.SCAM,
          desc: "desc-" + Math.random().toString(36).substring(2, 7),
        });
  }
  return reports;
};

export const makeImages = async (prisma: PrismaClient) => {
  const images = new Array<Prisma.ImageCreateManyInput>();

  for (let i = 0; i < nbImages; i++) {
    const postCount = await prisma.post.count();
    const skipPosts = Math.floor(Math.random() * postCount);
    const randPost = await prisma.post.findMany({
      take: 1,
      skip: skipPosts,
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!randPost || !randPost[0] || !randPost[0].id) {
      continue;
    }
    images.push({
      ext: "png",
      postId: randPost[0].id,
    });
  }
  return images;
};

export const makeRelationships = async (prisma: PrismaClient) => {
  const relationships = new Array<Prisma.RelationshipCreateManyInput>();

  for (let i = 0; i < nbRelationships; i++) {
    const userCount = await prisma.user.count({
      where: { role: Role.TENANT },
    });
    const skipUsers = Math.floor(Math.random() * userCount);
    const randUser = await prisma.user.findMany({
      where: { role: Role.TENANT },
      take: 1,
      skip: skipUsers,
      orderBy: {
        createdAt: "desc",
      },
    });
    const postCount = await prisma.post.count();
    const skipPosts = Math.floor(Math.random() * postCount);
    const randPost = await prisma.post.findMany({
      take: 1,
      skip: skipPosts,
      orderBy: {
        createdAt: "desc",
      },
    });
    if (
      !randUser ||
      !randUser[0] ||
      !randUser[0].id ||
      !randPost ||
      !randPost[0] ||
      !randPost[0].id
    ) {
      continue;
    }
    const isMatch = Boolean(Math.round(Math.random()));
    relationships.push({
      userId: randUser[0].id,
      postId: randPost[0].id,
      isMatch: isMatch,
    });
  }
  return relationships;
};
