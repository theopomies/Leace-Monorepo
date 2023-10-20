import {
  UserStatus,
  Role,
  PrismaClient,
  Prisma,
  PostType,
  HomeType,
  MaritalStatus,
  EnergyClass,
  RelationType,
} from "@prisma/client";

import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import axios from "axios";
import { readFileSync } from "fs";

import {
  nbUsers,
  attributeLocation,
  lat,
  lng,
  nbPostsPerAgency,
  nbRelationshipsPerUser,
  checkExistingAttribute,
  getRelationshipIds,
  getConversationIds,
  generateRandomJobName,
  generateRandomFirstName,
  generateRandomLastName,
  generateRandomUserDescriptions,
  generateRandomPostTitle,
  generateRandomPostDescriptions,
  checkExistingConversation,
  checkExistingRelationship,
} from "./utils";

import {
  getRandomInt,
  getUserIds,
  getPostIds,
  getRandomRentDates,
} from "./utils";

export const makeUsers = () => {
  const users = new Array<Prisma.UserCreateManyInput>();

  for (let i = 0; i < nbUsers; i++) {
    users.push({
      role: [Role.AGENCY, Role.TENANT][getRandomInt(0, 1)],
      email: Math.random().toString(36).substring(2, 7) + "@prisma.io",
      image: "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
      firstName: generateRandomFirstName(),
      lastName: generateRandomLastName(),
      phoneNumber: "+336" + Math.floor(10000000 + Math.random() * 90000000),
      country: "France",
      description: generateRandomUserDescriptions(),
      birthDate: new Date("01-01-2000"),
      job: generateRandomJobName(),
      employmentContract: ["CDI", "CDD"][getRandomInt(0, 1)],
      income: Math.floor(Math.random() * 100000) + 30000,
      //creditScore: ,
      maritalStatus: [MaritalStatus.MARRIED, MaritalStatus.SINGLE][
        getRandomInt(0, 1)
      ],
      status: [UserStatus.INACTIVE, UserStatus.ACTIVE][getRandomInt(0, 1)],
      isPremium: [true, false][getRandomInt(0, 1)],
    });
  }
  return users;
};

export const makeUserAttributes = async (prisma: PrismaClient) => {
  const attributes = new Array<Prisma.AttributeCreateManyInput>();

  const userIds = await getUserIds(Role.TENANT, prisma);

  for (let i = 0; i < userIds.length; i++) {
    const userId = userIds[i];
    if (!userId) continue;
    if (await checkExistingAttribute(prisma, undefined, userId)) continue;
    attributes.push({
      userId: userId,
      location: attributeLocation,
      lat: lat,
      lng: lng,
      maxPrice: getRandomInt(700, 3000),
      minPrice: getRandomInt(100, 600),
      maxSize: getRandomInt(60, 200),
      minSize: getRandomInt(10, 50),
      furnished: [true, false][getRandomInt(0, 1)],
      homeType: [HomeType.APARTMENT, HomeType.HOUSE][getRandomInt(0, 1)],
      terrace: [true, false][getRandomInt(0, 1)],
      pets: [true, false][getRandomInt(0, 1)],
      smoker: [true, false][getRandomInt(0, 1)],
      disability: [true, false][getRandomInt(0, 1)],
      garden: [true, false][getRandomInt(0, 1)],
      parking: [true, false][getRandomInt(0, 1)],
      elevator: [true, false][getRandomInt(0, 1)],
      pool: [true, false][getRandomInt(0, 1)],
    });
  }

  return attributes;
};

export const makePosts = async (prisma: PrismaClient) => {
  const posts = new Array<Prisma.PostCreateManyInput>();

  const userIds = await getUserIds(Role.AGENCY, prisma);

  for (let j = 0; j < userIds.length; j++) {
    for (let i = 0; i < nbPostsPerAgency; i++) {
      const createdBy = userIds[j];
      if (!createdBy) continue;
      posts.push({
        createdById: createdBy,
        certified: [true, false][getRandomInt(0, 1)],
        title: generateRandomPostTitle(),
        content: "",
        desc: generateRandomPostDescriptions(),
        type: [PostType.TO_BE_RENTED, PostType.RENTED][getRandomInt(0, 1)],
        energyClass: [EnergyClass.A, EnergyClass.C][getRandomInt(0, 1)],
        ges: [EnergyClass.A, EnergyClass.C][getRandomInt(0, 1)],
        constructionDate: new Date(
          +new Date("2000-01-01") +
            Math.random() * (+new Date() - +new Date("2000-01-01")),
        ),
        estimatedCosts: getRandomInt(50, 200),
        nearestShops: getRandomInt(0, 5),
        securityAlarm: [true, false][getRandomInt(0, 1)],
        internetFiber: [true, false][getRandomInt(0, 1)],
      });
    }
  }
  return posts;
};

export const makePostAttributes = async (prisma: PrismaClient) => {
  const attributes = new Array<Prisma.AttributeCreateManyInput>();

  const postIds = await getPostIds(prisma);

  for (let i = 0; i < postIds.length; i++) {
    const postId = postIds[i];
    if (!postId) continue;
    if (await checkExistingAttribute(prisma, postId, undefined)) continue;
    const { rentStartDate, rentEndDate } = getRandomRentDates();
    attributes.push({
      postId: postIds[i],
      location: attributeLocation,
      lat: lat,
      lng: lng,
      price: getRandomInt(100, 3000),
      size: getRandomInt(10, 200),
      rentStartDate: rentStartDate,
      rentEndDate: rentEndDate,
      furnished: [true, false][getRandomInt(0, 1)],
      homeType: [HomeType.APARTMENT, HomeType.HOUSE][getRandomInt(0, 1)],
      terrace: [true, false][getRandomInt(0, 1)],
      pets: [true, false][getRandomInt(0, 1)],
      smoker: [true, false][getRandomInt(0, 1)],
      disability: [true, false][getRandomInt(0, 1)],
      garden: [true, false][getRandomInt(0, 1)],
      parking: [true, false][getRandomInt(0, 1)],
      elevator: [true, false][getRandomInt(0, 1)],
      pool: [true, false][getRandomInt(0, 1)],
    });
  }

  return attributes;
};

export const makeRelationships = async (prisma: PrismaClient) => {
  const relationships = new Array<Prisma.RelationshipCreateManyInput>();

  const userIds = await getUserIds(Role.TENANT, prisma);
  const postIds = await getPostIds(prisma);

  for (let j = 0; j < userIds.length; j++) {
    for (let i = 0; i < nbRelationshipsPerUser; i++) {
      const relationType = getRandomInt(0, 2);
      if (relationType == 0) {
        const tenantId = userIds[j];
        if (!tenantId) continue;
        const postId = postIds[getRandomInt(0, postIds.length)];
        if (!postId) continue;
        if (await checkExistingRelationship(prisma, tenantId, postId)) continue;
        const relationType = RelationType.MATCH;
        if (!relationType) continue;
        relationships.push({
          userId: tenantId,
          postId: postId,
          relationType: relationType,
        });
      } else if (relationType == 1) {
        const tenantId = userIds[j];
        if (!tenantId) continue;
        const postId = postIds[getRandomInt(0, postIds.length)];
        if (!postId) continue;
        if (await checkExistingRelationship(prisma, tenantId, postId)) continue;
        const relationType = RelationType.TENANT;
        if (!relationType) continue;
        relationships.push({
          userId: tenantId,
          postId: postId,
          relationType: relationType,
        });
      } else {
        const tenantId = userIds[j];
        if (!tenantId) continue;
        const postId = postIds[getRandomInt(0, postIds.length)];
        if (!postId) continue;
        if (await checkExistingRelationship(prisma, tenantId, postId)) continue;
        const relationType = RelationType.POST;
        if (!relationType) continue;
        relationships.push({
          userId: tenantId,
          postId: postId,
          relationType: relationType,
        });
      }
    }
  }

  return relationships;
};

export const makeConversations = async (prisma: PrismaClient) => {
  const conversations = new Array<Prisma.ConversationCreateManyInput>();

  const relationshipIds = await getRelationshipIds(prisma);

  for (let j = 0; j < relationshipIds.length; j++) {
    const relationId = relationshipIds[j];
    if (!relationId) continue;
    if (await checkExistingConversation(prisma, relationId)) continue;
    conversations.push({
      relationId: relationId,
    });
  }

  return conversations;
};

export const makeMessages = async (prisma: PrismaClient) => {
  const messages = new Array<Prisma.MessageCreateManyInput>();

  const conversations = await getConversationIds(prisma);

  for (let j = 0; j < conversations.length; j++) {
    const conversationId = conversations[j]?.id;
    if (!conversationId) continue;
    const senderId_1 = conversations[j]?.relationship?.userId;
    if (!senderId_1) continue;
    const senderId_2 = conversations[j]?.relationship?.post.createdById;
    if (!senderId_2) continue;
    messages.push({
      conversationId: conversationId,
      senderId: senderId_1,
      content: "Bonjour !",
    });
    messages.push({
      conversationId: conversationId,
      senderId: senderId_2,
      content: "J'achete !",
    });
  }

  return messages;
};

export const makeImages = async (prisma: PrismaClient, s3Client: S3Client) => {
  const images = new Array<Prisma.ImageCreateManyInput>();

  const postIds = await getPostIds(prisma);

  for (let j = 0; j < postIds.length; j++) {
    const postId = postIds[j];
    if (!postId) continue;
    const ext = "jpg";
    images.push({
      postId: postId,
      ext: ext,
    });

    const id = randomUUID();
    const key = `posts/${postId}/images/${id}.${ext}`;
    const bucketParams = {
      Bucket: "leaceawsbucket",
      Key: key,
    };
    const command = new PutObjectCommand(bucketParams);

    const link = await getSignedUrl(s3Client, command);

    const imageBinaryData = readFileSync("./prisma/Jersey_City.jpg");

    try {
      await axios.put(link, imageBinaryData, {
        headers: {
          "Content-Type": "image/jpg",
        },
      });
    } catch (error) {
      continue;
    }
  }

  return images;
};
