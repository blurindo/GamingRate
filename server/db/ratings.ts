import { prisma } from "."
import { GameRate } from "@prisma/client"

export const createRating = (rateData: Omit<GameRate, "id" | "createdAt" | "updatedAt">) => {
    return prisma.gameRate.create({
        data: rateData
    })
}

export const getRatingByUserAndGame = async (userId: number, gameId: number) => {

    const gameRating: GameRate | null = await prisma.gameRate.findUnique({
        where: {
            userId_gameId: { // Use the composite unique key here
                userId: userId,
                gameId: gameId,
            },
        },
    })

    return gameRating;
}

export const getAllRatingByUser = async (userId: number) => {

    const gameRatings: GameRate[] | null = await prisma.gameRate.findMany({
        where: {
            userId: userId
        }
    })

    return gameRatings;
}

export const updateRating = async (rateData: Omit<GameRate, "id" | "createdAt">) => {
    const update = await prisma.gameRate.update({
        where: {
            userId_gameId: { // Use the composite unique key here
                userId: rateData.userId,
                gameId: rateData.gameId,
            },
        },
        data: {
            rate: rateData.rate,
            updatedAt: rateData.updatedAt,
        },
    });

    return update;
}

export const countUserRatings = async (userId: number) => {

    const countNumber: number = await prisma.gameRate.count({
        where: {
            userId: userId
        }
    })

    return countNumber;
}

export const getLastThreeRatingsByUser = async (userId: number) => {

    const gameRatings: GameRate[] | null = await prisma.gameRate.findMany({
        where: {
            userId: userId
        },
        take: 3,
        orderBy: {
            updatedAt: 'desc'
        }
    })

    return gameRatings;
}

export const getRatingById = async (rateId: number) => {
    const gameRating: GameRate | null = await prisma.gameRate.findUnique({
        where: {
            id: rateId,
          },
          include: {
            user: {
              select: {
                username: true,
                profileImage: true, 
              },
            },
          },
        });

    return gameRating;
}

export const getYourFriendGameRates = async (friendIds: number[]) => {
    const friendsGameRates = await prisma.gameRate.findMany({
        where: {
          userId: {
            in: friendIds,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              username: true,
              profileImage: true,
              id: true
            },
          },
        },
      });

      return friendsGameRates;
}