import { PostType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const PREMIUM_DAYS_ADVANTAGE = 1;

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

const deg2rad = (deg: number) => deg * (Math.PI / 180);
const rad2deg = (rad: number) => rad * (180 / Math.PI);
const earthRadius = 6371;

export async function getPostsWithAttribute(
  userId: string,
  isPremium: boolean,
) {
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

  let maxDate = new Date(); // Today
  if (!isPremium) {
    // 1 less day if not premium
    maxDate = new Date(
      maxDate.getTime() - 1000 * 60 * 60 * 24 * PREMIUM_DAYS_ADVANTAGE,
    );
  }

  const posts = await prisma.post.findMany({
    where: {
      createdAt: {
        lte: maxDate,
      },
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
