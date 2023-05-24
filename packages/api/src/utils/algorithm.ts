import { PostType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function movePostToSeen(userId: string, postId: string) {
  // move the specified post from postsTobeSeen to postsSeen in the user's profile
  await prisma.user.update({
    where: { id: userId },
    data: {
      postsToBeSeen: {
        disconnect: { id: postId },
      },
      postsSeen: {
        connect: { id: postId },
      },
    },
  });
}

export async function moveUserToSeen(userId: string, postId: string) {
  // move the specified post from postsTobeSeen to postsSeen in the user's profile
  await prisma.post.update({
    where: { id: postId },
    data: {
      usersToBeSeen: {
        disconnect: { id: userId },
      },
      usersSeen: {
        connect: { id: userId },
      },
    },
  });
}

const deg2rad = (deg: number) => deg * (Math.PI / 180);
const rad2deg = (rad: number) => rad * (180 / Math.PI);
const earthRadius = 6371;

export async function getPostsWithAttribute(userId: string) {
  const userAtt = await prisma.attribute.findUniqueOrThrow({
    where: { userId: userId },
  });

  // Return error if user has no lat, lng or range
  if (!userAtt.lat || !userAtt.lng || !userAtt.range) {
    throw new Error("User has no lat, lng or range");
  }

  // Calculate max and min lat and lng with the range
  const maxLat = userAtt.lat + rad2deg(userAtt.range / earthRadius);
  const minLat = userAtt.lat - rad2deg(userAtt.range / earthRadius);
  const maxLng =
    userAtt.lng +
    rad2deg(userAtt.range / earthRadius / Math.cos(deg2rad(userAtt.lat)));
  const minLng =
    userAtt.lng -
    rad2deg(userAtt.range / earthRadius / Math.cos(deg2rad(userAtt.lat)));

  const posts = await prisma.post.findMany({
    where: {
      type: PostType.TO_BE_RENTED,
      attribute: {
        AND: [
          {
            price: {
              gte: userAtt.minPrice ?? undefined,
              lte: userAtt.maxPrice ?? undefined,
            },
          },
          {
            size: {
              gte: userAtt.minSize ?? undefined,
              lte: userAtt.maxSize ?? undefined,
            },
          },
          { furnished: userAtt.furnished ?? undefined },
          { homeType: userAtt.homeType ?? undefined },
          { terrace: userAtt.terrace ?? undefined },
          { pets: userAtt.pets ?? undefined },
          { smoker: userAtt.smoker ?? undefined },
          { disability: userAtt.disability ?? undefined },
          { garden: userAtt.garden ?? undefined },
          { parking: userAtt.parking ?? undefined },
          { elevator: userAtt.elevator ?? undefined },
          { pool: userAtt.pool ?? undefined },
          {
            lat: {
              gte: minLat,
              lte: maxLat,
            },
          },
          {
            lng: {
              gte: minLng,
              lte: maxLng,
            },
          },
        ],
      },
      // Not created, seen or to be seen by the user
      NOT: {
        OR: [
          { createdById: userId },
          { seenBy: { some: { id: userId } } },
          { toBeSeenBy: { some: { id: userId } } },
        ],
      },
    },
    include: { attribute: true, images: { take: 1 } },
  });

  if (!posts) return [];

  // Shuffle posts with Fisher-Yates algorithm
  shuffle(posts);
  return posts.slice(0, 10);
}

export async function getUsersWithAttribute(postId: string) {
  const postAtt = await prisma.attribute.findUniqueOrThrow({
    where: { postId: postId },
  });

  // Return error if post has no lat, lng or range
  if (!postAtt.lat || !postAtt.lng || !postAtt.range) {
    throw new Error("User has no lat, lng or range");
  }

  // Calculate max and min lat and lng with the range
  const maxLat = postAtt.lat + rad2deg(postAtt.range / earthRadius);
  const minLat = postAtt.lat - rad2deg(postAtt.range / earthRadius);
  const maxLng =
    postAtt.lng +
    rad2deg(postAtt.range / earthRadius / Math.cos(deg2rad(postAtt.lat)));
  const minLng =
    (postAtt.lng ?? 0) -
    rad2deg(
      (postAtt.range ?? 999999) /
        earthRadius /
        Math.cos(deg2rad(postAtt.lat ?? 0)),
    );

  const users = await prisma.user.findMany({
    where: {
      attribute: {
        AND: [
          {
            price: {
              gte: postAtt.minPrice ?? 0,
              lte: postAtt.maxPrice ?? 999999,
            },
          },
          {
            size: {
              gte: postAtt.minSize ?? 0,
              lte: postAtt.maxSize ?? 999999,
            },
          },
          { furnished: postAtt.furnished ?? undefined },
          { homeType: postAtt.homeType ?? undefined },
          { terrace: postAtt.terrace ?? undefined },
          { pets: postAtt.pets ?? undefined },
          { smoker: postAtt.smoker ?? undefined },
          { disability: postAtt.disability ?? undefined },
          { garden: postAtt.garden ?? undefined },
          { parking: postAtt.parking ?? undefined },
          { elevator: postAtt.elevator ?? undefined },
          { pool: postAtt.pool ?? undefined },
          {
            lat: {
              gte: minLat,
              lte: maxLat,
            },
          },
          {
            lng: {
              gte: minLng,
              lte: maxLng,
            },
          },
        ],
      },
      // Not created, seen or to be seen by the user
      NOT: {
        OR: [
          { posts: { some: { id: postId } } },
          { seenBy: { some: { id: postId } } },
          { toBeSeenBy: { some: { id: postId } } },
        ],
      },
    },
    include: { attribute: true },
  });

  if (!users) return [];

  // Shuffle users with Fisher-Yates algorithm
  shuffle(users);
  return users.slice(0, 10);
}

export const shuffle = (array: unknown[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const temp = array[i]!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    array[i] = array[j]!;
    array[j] = temp;
  }
  return array;
};
