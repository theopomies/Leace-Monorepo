import { PrismaClient, RelationType, Role } from "@prisma/client";

export const nbUsers = 300;
export const nbPostsPerAgency = 1;
export const nbRelationshipsPerUser = 5;

export const attributeLocation = "33000 Bordeaux, France";
export const lat = 44.840549713;
export const lng = -0.575879827;

export const getUserIds = async (role: Role, prisma: PrismaClient) => {
  return await prisma.user
    .findMany({
      where: { role: role },
      select: { id: true },
    })
    .then((userIds) => {
      return userIds
        .filter((userId) => {
          if (!userId) return false;
          return true;
        })
        .map((userId) => {
          return userId.id;
        });
    });
};

export const getPostIds = async (prisma: PrismaClient) => {
  return await prisma.post
    .findMany({
      select: { id: true },
    })
    .then((postIds) => {
      return postIds
        .filter((postId) => {
          if (!postId) return false;
          return true;
        })
        .map((postId) => {
          return postId.id;
        });
    });
};

export const getRelationshipIds = async (prisma: PrismaClient) => {
  return await prisma.relationship
    .findMany({
      where: { relationType: RelationType.MATCH },
      select: { id: true },
    })
    .then((relationIds) => {
      return relationIds
        .filter((relationId) => {
          if (!relationId) return false;
          return true;
        })
        .map((relationId) => {
          return relationId.id;
        });
    });
};

export const getConversationIds = async (prisma: PrismaClient) => {
  return await prisma.conversation
    .findMany({
      select: {
        id: true,
        relationship: {
          select: { userId: true, post: { select: { createdById: true } } },
        },
      },
    })
    .then((conversationIds) => {
      return conversationIds.filter((conversation) => {
        if (!conversation) return false;
        if (!conversation.id) return false;
        if (!conversation.relationship) return false;
        if (!conversation.relationship.userId) return false;
        if (!conversation.relationship.post) return false;
        if (!conversation.relationship.post.createdById) return false;

        return true;
      });
    });
};

export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomRentDates = () => {
  const today = new Date();
  const minStartDate = new Date(
    today.getFullYear(),
    today.getMonth() - 6,
    today.getDate(),
  );
  const maxStartDate = new Date(
    today.getFullYear(),
    today.getMonth() - 12,
    today.getDate(),
  );

  const rentStartDate = new Date(
    +minStartDate +
      Math.random() * (maxStartDate.getTime() - minStartDate.getTime()),
  );

  const maxEndDate = new Date(rentStartDate);
  maxEndDate.setMonth(rentStartDate.getMonth() + 12);

  const rentEndDate = new Date(
    +rentStartDate +
      Math.random() * (maxEndDate.getTime() - rentStartDate.getTime()),
  );

  return { rentStartDate, rentEndDate };
};

export const checkExistingAttribute = async (
  prisma: PrismaClient,
  postId?: string,
  userId?: string,
) => {
  if (postId) {
    const postAttribute = await prisma.attribute.findFirst({
      where: { postId: postId },
    });

    if (postAttribute) return true;
    return false;
  }
  if (userId) {
    const userAttribute = await prisma.attribute.findFirst({
      where: { userId: userId },
    });

    if (userAttribute) return true;
    return false;
  }
};

export const checkExistingConversation = async (
  prisma: PrismaClient,
  relationshipId: string,
) => {
  const conversation = await prisma.conversation.findFirst({
    where: { relationId: relationshipId },
  });

  if (conversation) return true;
  return false;
};

export const checkExistingRelationship = async (
  prisma: PrismaClient,
  userId: string,
  postId: string,
) => {
  const relationship = await prisma.relationship.findFirst({
    where: { userId: userId, postId: postId },
  });

  if (relationship) return true;
  return false;
};

export const generateRandomFirstName = () => {
  const names = [
    "John",
    "Jane",
    "Michael",
    "Emily",
    "David",
    "Sarah",
    "Robert",
    "Laura",
  ];
  return names[Math.floor(Math.random() * names.length)];
};

export const generateRandomLastName = () => {
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Davis",
    "Miller",
    "Wilson",
    "Moore",
    "Taylor",
  ];
  return lastNames[Math.floor(Math.random() * lastNames.length)];
};

export const generateRandomJobName = () => {
  const jobList = [
    "Software Developer",
    "Teacher",
    "Nurse",
    "Engineer",
    "Graphic Designer",
    "Chef",
    "Marketing Manager",
    "Electrician",
    "Doctor",
    "Accountant",
  ];
  return jobList[Math.floor(Math.random() * jobList.length)];
};

export const generateRandomPostTitle = () => {
  const apartmentTitles = [
    "Appartement ensoleillé avec vue imprenable",
    "Spacieux appartement à louer près du centre-ville",
    "Studio confortable avec toutes les commodités",
    "Appartement moderne avec balcon et parking",
    "Appartement lumineux à deux pas du métro",
    "Charmant duplex avec jardin privé",
    "Appartement rénové dans un quartier calme",
    "Penthouse de luxe avec terrasse panoramique",
  ];
  return apartmentTitles[Math.floor(Math.random() * apartmentTitles.length)];
};

export const generateRandomPostDescriptions = () => {
  const apartmentDescriptions = [
    "Bel appartement récemment rénové avec vue sur la ville.",
    "Appartement spacieux idéalement situé pour les travailleurs et les étudiants.",
    "Studio confortable avec kitchenette et salle de bains privée.",
    "Appartement moderne avec de nombreuses commodités, y compris un parking sécurisé.",
    "Proche des transports en commun, des restaurants et des magasins.",
    "Maison de ville avec un charmant jardin privé, parfait pour la détente.",
    "Appartement récemment rénové dans un quartier résidentiel paisible.",
    "Penthouse de luxe avec une vue imprenable sur la ville et les montagnes.",
  ];
  return apartmentDescriptions[
    Math.floor(Math.random() * apartmentDescriptions.length)
  ];
};

export const generateRandomUserDescriptions = () => {
  const apartmentDescriptions = [
    "Bel appartement récemment rénové avec vue sur la ville.",
    "Appartement spacieux idéalement situé pour les travailleurs et les étudiants.",
    "Studio confortable avec kitchenette et salle de bains privée.",
    "Appartement moderne avec de nombreuses commodités, y compris un parking sécurisé.",
    "Proche des transports en commun, des restaurants et des magasins.",
    "Maison de ville avec un charmant jardin privé, parfait pour la détente.",
    "Appartement récemment rénové dans un quartier résidentiel paisible.",
    "Penthouse de luxe avec une vue imprenable sur la ville et les montagnes.",
  ];
  return apartmentDescriptions[
    Math.floor(Math.random() * apartmentDescriptions.length)
  ];
};
