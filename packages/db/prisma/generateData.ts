import {
  UserStatus,
  Roles,
  AccountType,
  ReportReason,
  PrismaClient,
  Prisma,
  PostType,
} from "@prisma/client";

const nbUsers = 10;
const nbPosts = 10;
const nbReports = 10;
const nbImages = 20;
const nbRelationShips = 10;

export const makeUsers = () => {
  const users = new Array<Prisma.UserCreateManyInput>();

  for (let i = 0; i < nbUsers; i++) {
    users.push({
      name: "name-" + Math.random().toString(36).substring(2, 7),
      firstName: "firstName-" + Math.random().toString(36).substring(2, 7),
      lastName: "lastName-" + Math.random().toString(36).substring(2, 7),
      email: Math.random().toString(36).substring(2, 7) + "@prisma.io",
      accountType: Boolean(Math.round(Math.random()))
        ? AccountType.TENANT
        : AccountType.OWNER,
      phoneNumber: "+336" + Math.floor(10000000 + Math.random() * 90000000),
      country: "France",
      description: "description-" + Math.random().toString(36).substring(2, 7),
      birthDate: new Date("01-01-2000"),
      status: Boolean(Math.round(Math.random()))
        ? UserStatus.ACTIVE
        : UserStatus.INACTIVE,
      isPremium: Boolean(Math.round(Math.random())) ? true : false,
      role: Roles.USER,
    });
  }
  return users;
};

export const makePosts = async (prisma: PrismaClient) => {
  const posts = new Array<Prisma.PostCreateManyInput>();

  for (let i = 0; i < nbPosts; i++) {
    const userCount = await prisma.user.count({
      where: { accountType: AccountType.OWNER },
    });
    const skip = Math.floor(Math.random() * userCount);
    const createdBy = await prisma.user.findMany({
      where: { accountType: AccountType.OWNER },
      take: 1,
      skip: skip,
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!createdBy || !createdBy[0] || !createdBy[0].id) {
      continue;
    }
    posts.push({
      createdById: createdBy[0].id,
      title: "title-" + Math.random().toString(36).substring(2, 7),
      content: "content-" + Math.random().toString(36).substring(2, 7),
      desc: "desc-" + Math.random().toString(36).substring(2, 7),
      price: Math.floor(Math.random() * (5000 - 100) + 100),
      type: Boolean(Math.round(Math.random()))
        ? PostType.RENTED
        : PostType.TO_BE_RENTED,
      rentStartDate: new Date("2023-04-02"),
      size: Math.floor(Math.random() * (80 - 15) + 80),
      furnished: Boolean(Math.round(Math.random())) ? true : false,
    });
  }
  return posts;
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
      where: { accountType: AccountType.TENANT },
    });
    const skipUsers = Math.floor(Math.random() * ownerCount);
    const randUser = await prisma.user.findMany({
      where: { accountType: AccountType.TENANT },
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
    const userCount = await prisma.user.count();
    const skipUsers = Math.floor(Math.random() * userCount);
    const randUser = await prisma.user.findMany({
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
    Boolean(Math.round(Math.random()))
      ? images.push({
          url: "https://media.istockphoto.com/id/638756792/photo/beautiful-woman-posing-against-dark-background.jpg?s=612x612&w=0&k=20&c=AanwEr0pmrS-zhkVJEgAwxHKwnx14ywNh5dmzwbpyLk=",
          userId: randUser[0].id,
        })
      : images.push({
          url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2160&q=80",
          postId: randPost[0].id,
        });
  }
  return images;
};

export const makeRelationShips = async (prisma: PrismaClient) => {
  const relationships = new Array<Prisma.RelationShipCreateManyInput>();

  for (let i = 0; i < nbRelationShips; i++) {
    const userCount = await prisma.user.count({
      where: { accountType: AccountType.TENANT },
    });
    const skipUsers = Math.floor(Math.random() * userCount);
    const randUser = await prisma.user.findMany({
      where: { accountType: AccountType.TENANT },
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
    Boolean(Math.round(Math.random()))
      ? relationships.push({
          userId: isMatch ? randUser[0].id : "",
          postId: randPost[0].id,
          isMatch: isMatch,
        })
      : relationships.push({
          userId: randUser[0].id,
          postId: isMatch ? randPost[0].id : "",
          isMatch: isMatch,
        });
  }
  return relationships;
};
